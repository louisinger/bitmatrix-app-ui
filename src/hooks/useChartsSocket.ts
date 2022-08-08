import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { ChartSummary } from '@bitmatrix/models';
import { usePoolContext } from '../context';
import { API_SOCKET_SERVER_URL } from '../config';
import { notify } from '../components/utils/utils';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useChartsSocket = () => {
  const { poolsContext } = usePoolContext();

  const [isChartsConnected, setIsChartsConnected] = useState<boolean>(false);
  const [chartsData, setChartsData] = useState<ChartSummary[]>();
  const [chartsLoading, setChartsLoading] = useState<boolean>(true);

  const onChartsData = useCallback((chartsData: ChartSummary[]) => {
    setChartsData(chartsData);
    setChartsLoading(false);
  }, []);

  useEffect(() => {
    const socket = io(API_SOCKET_SERVER_URL);
    // const poolIds = poolsContext.map((pc) => pc.id);

    socket.on('connect', () => {
      console.log('connect charts');
      setIsChartsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('disconnect charts');
      notify('Charts socket disconnect.', 'Bitmatrix Error : ');
      setIsChartsConnected(false);
    });

    // socket.emit('fetchpools', poolIds);

    socket.on('poolschart', (data) => {
      console.log(data);
      if (data && data.length > 0) onChartsData(data);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
      setIsChartsConnected(false);
      console.log('cleanup charts');
    };
  }, [poolsContext]);

  return {
    isChartsConnected,
    chartsLoading,
    chartsData,
  };
};
