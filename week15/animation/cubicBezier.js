export default function(...controlPs) {
  const points = [0, 0, ...controlPs, 1, 1];

  let resLine = [0, 0];

  for(let frag = 1; frag < 101; frag++) {
    let p = frag / 100;
    let tempPoints = points.slice();

    while (tempPoints.length > 2) {
      let createPoints = [];
      for (let i = 0; i < tempPoints.length / 2 - 1; i++) {
        createPoints.push(...(
          [0, 1].map(v => 
            (tempPoints[(i + 1) * 2 + v] - tempPoints[i * 2 + v]) * p
             + tempPoints[i * 2 + v])
          )
        );
      }
      
      if (createPoints.length === 2) {
        resLine.push(...createPoints);
      }
      
      tempPoints = createPoints;
    }
  }

  return function(t) {
    if (t < 0) return 0;
    for(let i = 0; i < resLine.length / 2 - 1; i++) {
      if (resLine[i * 2] <= t && t <= resLine[(i + 1) * 2]) {
        let sDis = resLine[(i + 1) * 2] - resLine[i * 2];
        let oDis = t - resLine[i * 2];
        return (resLine[(i + 1) * 2 + 1] - resLine[i * 2 + 1]) * oDis / sDis + resLine[i * 2 + 1];
      }
    }
    return 1;
  }
}
