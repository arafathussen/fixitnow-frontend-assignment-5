export const jwtUtils = {
  verifyToken(token: string): { success: boolean; data?: any } {
    if (!token || typeof token !== 'string' || !token.includes('.')) {
      return { success: false };
    }
    
    try {
      // Decode JWT payload manually using base64 to ensure Edge runtime compatibility
      const base64Url = token.split('.')[1];
      if (!base64Url) return { success: false };
      
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Pad string with '=' to make it a multiple of 4
      while (base64.length % 4) {
        base64 += '=';
      }
      
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const decoded = JSON.parse(jsonPayload);
      if (!decoded) return { success: false };
      
      return { success: true, data: decoded };
    } catch {
      // Silently return false to prevent Next.js dev overlay from popping up on malformed tokens
      return { success: false };
    }
  },
};
