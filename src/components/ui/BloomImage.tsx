import { useEffect, useRef, useState } from 'react'

type BloomImageProps = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  eager?: boolean
}

export function BloomImage({ src, alt, className = '', imgClassName = '', eager }: BloomImageProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(Boolean(eager))

  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true)
    }
  }, [src])

  // Do not force `relative` here — callers often pass `absolute`, and a later
  // `relative` utility in the CSS bundle would win and break overlays.
  return (
    <div className={`overflow-hidden bg-image-wash ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`h-full w-full object-cover transition duration-700 ease-out ${
          loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
        } ${imgClassName}`}
      />
    </div>
  )
}
