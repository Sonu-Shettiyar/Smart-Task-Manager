

import React, { useEffect } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { Navigation } from '@/components/Navigation';
import { UserProfile } from '@/components/profile/UserProfile';
import { useRouter } from 'next/router';

const Profile: React.FC = () => {
  const { state, utils } = useTask();
  const { currentUser, tasks } = state;
  const router = useRouter();


  useEffect(() => {
    if (!currentUser) {
      router.push('/')
    }

  }, [currentUser,router])

  const userTasks = utils.getUserTasks(currentUser?.id || '', tasks);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and view your task statistics.
          </p>
        </div>

        <UserProfile
          user={currentUser}
          userTasks={userTasks}
          allTasks={tasks}
        />
      </div>
    </div>
  );
};
export default Profile;
