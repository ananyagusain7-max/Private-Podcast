import { useEffect, useState } from 'react';
import type { ModelTier } from '../utils/deviceDetect';
import { getModelTier } from '../utils/deviceDetect';

type DeviceCapabilityState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'ready'; tier: ModelTier };

export function useDeviceCapability(): DeviceCapabilityState {
  const [state, setState] = useState<DeviceCapabilityState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    getModelTier()
      .then((tier) => {
        if (!cancelled) setState({ status: 'ready', tier });
      })
      .catch((error: unknown) => {
        if (cancelled) return;

        setState({
          status: 'error',
          error: error instanceof Error ? error : new Error('Failed to detect device capability'),
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
