function unsplash(id: string, width = 900) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`
}

function pexels(id: number, width = 900, slug?: string) {
  const file = slug ? `${slug}.jpeg` : `pexels-photo-${id}.jpeg`
  return `https://images.pexels.com/photos/${id}/${file}?auto=compress&cs=tinysrgb&w=${width}`
}

export const images = {
  hero: unsplash('photo-1487530811176-3780de880c2d', 1800),
  valentines: unsplash('photo-1526047932273-341f2a7631f9', 1400),
  birthday: unsplash('photo-1563241527-3004b7be0ffd', 1400),
  anniversary: unsplash('photo-1496062031456-07b8f162a322', 1400),
  mothers: unsplash('photo-1494336877155-7fb9c6984f0a', 1400),
  graduation: unsplash('photo-1490750967868-88aa4486c946', 1400),
  christmas: pexels(2058498, 1400),
  justBecause: unsplash('photo-1518895949257-7621c3c786d7', 1400),
  about: pexels(169193, 1400),
  studio: unsplash('photo-1591886960571-74d43a9d4166', 1400),
  cta: unsplash('photo-1527061011665-3652c757a4d4', 1600),
  contact: pexels(2253870, 1400),
  redRoses: unsplash('photo-1496062031456-07b8f162a322', 1200),
  blush: pexels(736230, 1200),
  white: unsplash('photo-1487530811176-3780de880c2d', 1200),
  pastel: pexels(931177, 1200),
  birthdayBloom: pexels(74512, 1200),
  garden: unsplash('photo-1494336877155-7fb9c6984f0a', 1200),
  loveGrace: unsplash('photo-1518895949257-7621c3c786d7', 1200),
  sunset: pexels(2058498, 1200),
  forever: pexels(56866, 1200, 'garden-rose-red-pink-56866'),
  pink: unsplash('photo-1563241527-3004b7be0ffd', 1200),
  box: unsplash('photo-1591886960571-74d43a9d4166', 1200),
  anniversaryGarden: pexels(931162, 1200),
  mothersClassic: pexels(4612235, 1200),
  pastelBox: pexels(931162, 1200),
  ivory: unsplash('photo-1487530811176-3780de880c2d', 1200),
  ruby: unsplash('photo-1519378058457-4c29a0a2efac', 1200),
  tulips: pexels(2058498, 1200),
  lilac: unsplash('photo-1527061011665-3652c757a4d4', 1200),
  botanical: unsplash('photo-1494336877155-7fb9c6984f0a', 1200),
  classicRose: pexels(56866, 1200, 'garden-rose-red-pink-56866'),
}

export function gallery(primary: string, extras: string[]) {
  return [primary, ...extras]
}
