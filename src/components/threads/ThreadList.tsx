import React from 'react';
import { ThreadPost, ThreadPostProps } from './ThreadPost';

export interface ThreadListProps {
  threads: ThreadPostProps[];
  onCopyThread?: (threadId: string) => void;
  onGenerateThreadImage?: (threadId: string) => void;
}

export const ThreadList: React.FC<ThreadListProps> = ({
  threads,
  onCopyThread,
  onGenerateThreadImage
}) => {
  return (
    <div className="space-y-4 w-full">
      {threads.map(thread => (
        <ThreadPost 
          key={thread.id}
          {...thread}
          onCopy={onCopyThread}
          onGenerateImage={onGenerateThreadImage}
        />
      ))}
    </div>
  );
};
