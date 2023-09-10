function seconds(seconds: number, speedMultiplier: number = 1) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000 * speedMultiplier));
  }