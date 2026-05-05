import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="p-6 bg-white h-screen flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="space-y-6 flex-1">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        ))}
      </div>
      <Skeleton className="h-14 w-full rounded-2xl mt-8" />
    </div>
  );
};

export const HomeSkeleton = () => {
  return (
    <div className="h-screen w-screen bg-slate-50 flex flex-col">
      <div className="flex-1 bg-slate-200 animate-pulse" />
      <div className="h-2/5 p-6 bg-white rounded-t-[40px] space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-24 rounded-3xl" />
          <Skeleton className="h-24 rounded-3xl" />
          <Skeleton className="h-24 rounded-3xl" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
