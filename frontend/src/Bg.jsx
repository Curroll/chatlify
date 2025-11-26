import React from 'react'

const Bg = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">

  {/* Animated Moving Grid */}
  <div
    className="
      absolute inset-0
      bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),
          linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]
      bg-[size:32px_32px]
      animate-grid
      dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),
          linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]
    "
  />

  {/* Pink Blob (Animated) */}
  <div
    className="
      absolute -top-20 -left-16
      size-[30rem]
      bg-pink-500
      opacity-30
      blur-[150px]
      rounded-full
      animate-float animate-pulse-glow
      dark:opacity-20
    "
  />

  {/* Blue Blob (Animated) */}
  <div
    className="
      absolute -bottom-20 -right-16
      size-[30rem]
      bg-cyan-500
      opacity-30
      blur-[150px]
      rounded-full
      animate-float animate-pulse-glow
      dark:opacity-20
    "
  />

</div>

  )
}

export default Bg