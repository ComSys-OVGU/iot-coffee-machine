const fieldTypes = {
  'u1': {
    len: 8
  },
  'b1': {
    len: 1
  },
  'b2': {
    len: 2
  },
  'b3': {
    len: 3
  },
  'b4': {
    len: 4
  },
  'b8': {
    len: 8
  }
}

const fieldTypeLen = (field) =>
  // if there's a type and we have a mapping for it, use it
  (fieldTypes[field.type] && fieldTypes[field.type].len) ||
  // if not, but there's a type on the field, use this (maybe node-packet knows about it)
  field.type ||
  // if not, but there's a size, just make it an size-count bitfield
  (field.size && field.size * 8)

const mapField = (field, idPrefix = '') => {
  const typeLen = fieldTypeLen(field) || 8

  return {
    mapped: `b${typeLen} => ${idPrefix}${field.id}`,
    mappedId: `${idPrefix}${field.id}`,
    typeLen,
    // some fields need wrapping (eg bit-fields), because they are sized other than full 8 bits
    needsWrap: (typeLen % 8 !== 0)
  }
}

const mapFields = (fields) => {
  const mappedFields = fields.map((field) => field.mapped).join(', ')
  const typeLen = fields.reduce((acc, field) => acc + field.typeLen, 0)

  let mapped = mappedFields
  if (fields.some((field) => field.needsWrap)) {
    // if there are wrapped fields, return a Bit Packed Integer
    mapped = `b${typeLen}{${mappedFields}}`
  }

  return {
    mapped,
    typeLen
  }
}

const resolveField = (field, types, parentField) => {
  const fieldType = types[field.type]
  if (fieldType) {
    // this is a custom type, make sure to resolve it
    return {
      ...field,
      ...resolveType(fieldType, types, field)
    }
  } else {
    // there's nothing for us to map, return the field and map it for node-packet
    // NOTE: the idPrefix will only work 1-level-deep, this is intentional so as to not pollute the namespace
    // Also, you can disable the idPrefix by naming parents with an underscore as the last char
    const idPrefix = (parentField && !parentField.id.endsWith('_') && (parentField.id + '_'))
    return {
      ...field,
      ...mapField(field, idPrefix || undefined)
    }
  }
}

const resolveType = (type, types, parentField) => {
  if (!parentField && !(type.doc && type.doc.includes('__GENERATE__'))) {
    // do not resolve types that are neither marked for generation nor included via a parent
    return null
  }

  const fields = type.seq.map((field) => resolveField(field, types, parentField))
  return {
    fields,
    ...mapFields(fields)
  }
}

export const resolveTypes = (types) => Object.keys(types).reduce((acc, key) => {
  const resolvedType = resolveType(types[key], types)
  return resolvedType ? {...acc, [key]: resolvedType} : acc
}, {})
