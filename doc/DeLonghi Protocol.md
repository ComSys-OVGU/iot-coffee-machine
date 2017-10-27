# DeLonghi Protocol

## General Information

### Harware Connections

The hardware can be connected by intercepting the plug that connects the LCD Board to the Power Board.
This plug is different depending on the exact model of the machine, yet it always carries the same signals:

* (1) -13V
* (3) -5V
* (4) GND
* (7) SPI MISO
* (8) SPI MOSI
* (9) SPI CLK

The pinout for the 11pin connector (`X4`) is laid out above, the 8-pin connector is assumed to carry the same signals but the pinout is unknown.

NOTE: GND is NOT referenced to mains earth or floating!
Instead between GND and mains earth there's a potential of 220V on certain machines.
**DO NOT CONNECT ANY MAINS-EARTH-REFERENCED DEVICE SUCH AS USB LOGIC ANALYZER OR SCOPE WITHOUT ISOLATION**

### SPI Parameters

* MSB
* 8 Bits per Byte
* SPI Mode 3
** Clock is high when inactive (CPOL = 1)
** Data is valid on Clock Trailing Edge (CPHA = 1)

### Protocol Information

* 9 Byte Packets
** Byte 0 Sync
** Bytes 1-7 Payload
** Byte 8 Checksum
* the display send current state to the Powerboard
* state includes:
** current time from RTC
** buttons pressed by the user

## LCD -> Powerboard
### Timing

Packages (Sync bytes) are sent 60ms apart (first clock cycle to first).
Each bit is sent @125kHz, i.e. 8µs apart, thus each byte takes 56µs to transfer. Between the first two bytes of each package, there is a pause of 2.5ms (after the first byte this increases to 2.92ms) and thus it takes 23.4ms (9*56µs + 2,5ms + 7*2,92ms) for a whole package to be sent. Between packages there is a pause of 36ms.

### Example Package

```
    B00020060E301280FB
```

### State

Each package can be decoded into the following parts, where bytes marked as `??` are still unknown at the time of writing.

```
    SSABCDXXHHMMSS??CC
```

#### SS - Sync Byte

Each package begins with a sync byte `0xB0`, this can be used to sync the SPI transmissions to packages instead of bytes.

#### ABCD - Buttons

The current state of all buttons on the front panel (as well as a hidden one, located below the power button) are encoded in the packge.
Each button occupies a single bit in these two bytes and the mapping is as following:

```
          AAAABBBBCCCCDDDD
        0b0000000000000001: 'ONE_BIG_COFFEE',
        0b0000000000000010: 'CAPPUCHINO',
        0b0000000000000100: 'LATTE_MACCHIATO',
        0b0000000000001000: 'CAFFEE_LATTE',
        0b0000000000010000: 'TWO_BIG_COFFEES',
        0b0000000000100000: 'UNKNOWN_1', // seems to be always set
        0b0000000001000000: 'UNKNOWN_2',
        0b0000000010000000: 'UNKNOWN_3',
        0b0000000100000000: 'PWR',
        0b0000001000000000: 'POSSIBLY_HIDDEN_BTN',
        0b0000010000000000: 'P',
        0b0000100000000000: 'FLUSH_WATER',
        0b0001000000000000: 'HOT_WATER',
        0b0010000000000000: 'OK',
        0b0100000000000000: 'ONE_SMALL_COFFEE',
        0b1000000000000000: 'TWO_SMALL_COFFEES',
```

#### XX - Alternating Byte

This byte alernates between `0x06` and `0x8E`, the meaning and use of this byte is unknown.

#### HHMMSS - RTC Time

These 3 bytes hold the current time returned by the RTC on the display board. Time is encoded in hex and counts up every second:

```
    hour = (timeBytes & 0xFF0000) >> 16
    min  = (timeBytes & 0x00FF00) >> 8
    sec  = (timeBytes & 0x0000FF)
```

#### CC - Checksum

Each packet ends with one byte of checksum. This checksum is derived from the first 8 bytes of a packet and is calculated as the sum of the bytes (% 256), starting at `0x55` instead of `0`.

A sample implementation is provided below:

```
    static uint8_t checksum(uint8_t* packet) {
        int sum = 0x55; // this is the start value delonghi uses

        int i = 0;
        for(; i < 8; i++) {
            sum = (sum + packet[i]) % 256;
        }
        return sum;
    }
```