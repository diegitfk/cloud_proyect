import useSWR from 'swr';

export interface PendingShare {
  _id: string;
  emisor: {
    username: string;
    nombre: string;
  };
  name: string;
  type: 'folder' | 'file';
  space: number;
  state: string;
}

interface PendingSharesResponse {
  tree: {
    shared_pending: PendingShare[];
  };
}
const fetcher = (url : string) => fetch(url).then(res => res.json())


export function usePendingShares() {
  const { data, error, mutate } = useSWR<PendingSharesResponse>(
    '/api/pending_share',
    fetcher,
    {
        refreshInterval : 10000
    }
  );

  const handleAccept = async (id: string) => {
    try {
      await fetcher(`/api/accept_resouce?idPending=${id}`);
      mutate();
    } catch (error) {
      console.error('Error accepting share:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await fetcher(`/api/reject_resource?idPending=${id}`);
      mutate();
    } catch (error) {
      console.error('Error rejecting share:', error);
    }
  };

  return {
    pendingShares: data?.tree.shared_pending ?? [],
    isLoading: !error && !data,
    isError: error,
    mutate,
    handleAccept,
    handleReject,
  };
}