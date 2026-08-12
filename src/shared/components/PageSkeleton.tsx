import React from 'react';
import { Skeleton, Box } from '@mui/material';

export default function PageSkeleton() {
  return (
    <Box className="animate-fade-in" sx={{ p: 0 }}>
      {/* Page Header Skeleton */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Skeleton variant="text" width={200} height={36} sx={{ bgcolor: 'rgba(124,58,237,0.1)', borderRadius: 2 }} />
          <Skeleton variant="text" width={140} height={20} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1 }} />
        </Box>
        <Skeleton variant="rounded" width={120} height={36} sx={{ bgcolor: 'rgba(124,58,237,0.1)', borderRadius: 2 }} />
      </Box>

      {/* Cards Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} variant="rounded" height={120}
            sx={{ bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 3 }} />
        ))}
      </Box>

      {/* Table Skeleton */}
      <Skeleton variant="rounded" height={400}
        sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3 }} />
    </Box>
  );
}
