export function getCategoryFallbackImage(categoryName?: string, serviceTitle?: string): string {
  const text = `${categoryName || ""} ${serviceTitle || ""}`.toLowerCase();

  if (text.includes("cctv") || text.includes("security") || text.includes("camera")) {
    return "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800&auto=format&fit=crop";
  }
  if (text.includes("plumb") || text.includes("pipe") || text.includes("leak") || text.includes("faucet") || text.includes("drain")) {
    return "https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=800&auto=format&fit=crop";
  }
  if (text.includes("electr") || text.includes("wiring") || text.includes("switch") || text.includes("circuit") || text.includes("power")) {
    return "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop";
  }
  if (text.includes("clean") || text.includes("wash") || text.includes("maid") || text.includes("mop")) {
    return "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop";
  }
  if (text.includes("paint") || text.includes("wall") || text.includes("decor")) {
    return "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop";
  }
  if (text.includes("ac") || text.includes("air") || text.includes("hvac") || text.includes("cool")) {
    return "https://images.unsplash.com/photo-1631545806653-5eb72a9e527d?q=80&w=800&auto=format&fit=crop";
  }
  if (text.includes("carpen") || text.includes("wood") || text.includes("furnit")) {
    return "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=800&auto=format&fit=crop";
  }
  if (text.includes("garden") || text.includes("lawn") || text.includes("plant")) {
    return "https://images.unsplash.com/photo-1558904541-efa8c196b27d?q=80&w=800&auto=format&fit=crop";
  }

  // Universal high-quality home service fallback
  return "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=800&auto=format&fit=crop";
}
