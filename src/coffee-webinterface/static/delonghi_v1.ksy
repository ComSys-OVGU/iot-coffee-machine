meta:
  id: delonghi_v1
  endian: be
  file-extension: delonghi_v1
seq:
  - id: packets
    type: packet
    repeat: eos
types:
  packet:
    doc: | 
      This is a meta-package type for use with ide.kaitai.io
      Currently, it is not supported by node-packet and thus must not be generated
    seq:
      - id: packet_type
        type: u1
        enum: packet_type
      - id: body
        size: 7
        type:
          switch-on: packet_type
          cases:
            'packet_type::lcd': lcd_body
            'packet_type::powerboard': pb_body
      - id: checksum
        type: u1
  lcd:
    doc: __GENERATE__
    seq:
      - id: packet_type
        type: u1
        enum: packet_type
      - id: 'body_'
        size: 7
        type: lcd_body
      - id: checksum
        type: u1
  pb:
    doc: __GENERATE__
    seq:
      - id: packet_type
        type: u1
        enum: packet_type
      - id: 'body_'
        size: 7
        type: pb_body
      - id: checksum
        type: u1

  lcd_body:
    seq:
      - id: buttons
        type: lcd_buttons
      - id: alternating
        type: u1
      - id: time
        type: lcd_time
      - id: last_byte
        type: lcd_last_byte
  pb_body:
    seq:
      - id: byte_0_
        type: pb_body_0
      - id: byte_1_
        type: pb_body_1
      - id: byte_2_
        type: pb_body_2
      - id: byte_3_
        type: pb_body_3
      - id: byte_4_
        type: pb_body_4
      - id: byte_5_
        type: pb_body_5
      - id: byte_6_
        type: pb_body_6
  lcd_time:
    seq:
      - id: hour
        type: u1
      - id: minute
        type: u1
      - id: second
        type: u1
  lcd_buttons:
    seq:
      - id: two_small_coffees
        type: b1
      - id: one_small_coffee
        type: b1
      - id: ok
        type: b1
      - id: hot_water
        type: b1
      - id: flush_water
        type: b1
      - id: p
        type: b1
      - id: possibly_hidden
        type: b1
      - id: pwr
        type: b1
      - id: unknown_3
        type: b1
      - id: unknown_2
        type: b1
      - id: unknown_1
        type: b1
      - id: two_big_coffees
        type: b1
      - id: caffee_latte
        type: b1
      - id: latte_macchiato
        type: b1
      - id: cappuchino
        type: b1
      - id: one_big_coffee
        type: b1
  lcd_last_byte:
    seq:
      - id: unknown
        type: b4
      - id: cnt_buttons
        type: b4
  pb_body_x:
    seq:
      - id: bit_0
        type: b1
      - id: bit_1
        type: b1
      - id: bit_2
        type: b1
      - id: bit_3
        type: b1
      - id: bit_4
        type: b1
      - id: bit_5
        type: b1
      - id: bit_6
        type: b1
      - id: bit_7
        type: b1
  pb_body_0:
    seq:
      # byte_0_bit_0 (b1)
      - id: unknown_0_0
        type: b1

      # byte_0_bit_1 (b1)
      - id: unknown_0_1
        type: b1

      # byte_0_bit_2 (b1)
      - id: unknown_0_2
        type: b1

      # byte_0_bit_3 (b1)
      - id: state_menu
        type: b1

      # byte_0_bit_4 (b1)
      - id: mode
        type: b4

  pb_body_1:
    seq:
      # byte_1_bit_0 (b1)
      - id: unknown_1
        type: b8
        doc: |
          If the mode is set to 0x0, then bytes 1-6 set will turn the display off

  pb_body_2:
    seq:
      # byte_2_bit_0 (b1)
      - id: msg_3rd_row
        type: b8

  pb_body_3:
    seq:
      # byte_3_bit_0 (b1)
      - id: unknown_3_0
        type: b1

      # byte_3_bit_1 (b1)
      - id: setting_key_beep
        type: b1

      # byte_3_bit_2 (b1)
      - id: setting_language
        type: b3

      # byte_3_bit_5 (b1)
      - id: unknown_3_5
        type: b1

      # byte_3_bit_6 (b1)
      - id: setting_12h_24h
        type: b1

      # byte_3_bit_7 (b1)
      - id: unknown_3_7
        type: b1

  pb_body_4:
    seq:
      # byte_4_bit_0 (b1)
      - id: unknown_4_0
        type: b1

      # byte_4_bit_1 (b1)
      - id: unknown_4_1
        type: b1

      # byte_4_bit_2 (b1)
      - id: unknown_4_2
        type: b1

      # byte_4_bit_3 (b1)
      - id: sensor_klappe_schliessen
        type: b1

      # byte_4_bit_4 (b1)
      - id: unknown_4_4
        type: b1

      # byte_4_bit_5 (b1)
      - id: unknown_4_5
        type: b1

      # byte_4_bit_6 (b1)
      - id: unknown_4_6
        type: b1

      # byte_4_bit_7 (b1)
      - id: unknown_4_7
        type: b1

  pb_body_5:
    seq:
      # byte_5_bit_0 (b1)
      - id: unknown_5_0
        type: b1

      # byte_5_bit_1 (b1)
      - id: unknown_5_1_white_screen
        type: b1

      # byte_5_bit_2 (b1)
      - id: msg_vorgemahlner_kaffee
        type: b1

      # byte_5_bit_3 (b1)
      - id: msg_zu_fein_gemahlen
        type: b1

      # byte_5_bit_4 (b1)
      - id: unknown_5_4
        type: b1

      # byte_5_bit_5 (b1)
      - id: sensor_bitte_entkalken
        type: b1

      # byte_5_bit_6 (b1)
      - id: sensor_kaffeesatz_leeren
        type: b1

      # byte_5_bit_7 (b1)
      - id: sensor_wassertank_fuellen
        type: b1

  pb_body_6:
    seq:
      # byte_6_bit_0 (b1)
      - id: unknown_6_0
        type: b1

      # byte_6_bit_1 (b1)
      - id: unknown_6_1
        type: b1

      # byte_6_bit_2 (b1)
      - id: msg_kaffeemenge_reduzieren
        type: b1

      # byte_6_bit_3 (b1)
      - id: unknown_6_3
        type: b1

      # byte_6_bit_4 (b1)
      - id: unknown_6_4
        type: b1

      # byte_6_bit_5 (b1)
      - id: unknown_6_5
        type: b1

      # byte_6_bit_6 (b1)
      - id: unknown_6_6
        type: b1

      # byte_6_bit_7 (b1)
      - id: unknown_6_7
        type: b1
enums:
  packet_type:
    0xB0: lcd
    0x0B: powerboard