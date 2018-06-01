enum Scope {
  TYPE = (1 << 2) - 1, // 0011 Lower two bits
  LEVEL = ((1 << 2) - 1) << 2, // 1100 Higher two bits

  ATTRIBUTE = (1 << 0) | LEVEL, // 1101
  BLOT = (1 << 1) | LEVEL, // 1110
  INLINE = (1 << 2) | TYPE, // 0111
  BLOCK = (1 << 3) | TYPE, // 1011

  BLOCK_BLOT = BLOCK & BLOT, // 1010
  INLINE_BLOT = INLINE & BLOT, // 0110
  BLOCK_ATTRIBUTE = BLOCK & ATTRIBUTE, // 1001
  INLINE_ATTRIBUTE = INLINE & ATTRIBUTE, // 0101

  ANY = TYPE | LEVEL,
}

export default Scope;
