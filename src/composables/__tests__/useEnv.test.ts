import { describe, it, expect } from 'vite-plus/test';
import { useEnv } from '../useEnv';

describe('useEnv', () => {
  it('returns defaults when env is empty object', () => {
    const env = useEnv({} as ImportMetaEnv);
    expect(env.apiURL).toBe('/api');
    expect(env.publicPath).toBe('/');
    expect(env.envName).toBe('development');
  });

  it('reads values from env object', () => {
    const env = useEnv({ VITE_API_BASE_URL: '/custom-api' } as unknown as ImportMetaEnv);
    expect(env.apiURL).toBe('/custom-api');
  });

  it('returns 0 when VITE_TCC_APP_ID is empty or missing', () => {
    const env = useEnv({} as ImportMetaEnv);
    expect(env.tccAppId).toBe(0);
  });

  it('returns fallback for optional fields', () => {
    const env = useEnv({} as ImportMetaEnv);
    expect(env.allowedHost).toBe('');
    expect(env.proxyTarget).toBe('');
  });
});
