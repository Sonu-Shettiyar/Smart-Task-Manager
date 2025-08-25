import React, { useEffect } from 'react';
import { useTask } from '@/contexts/TaskContext';
import { LoginForm } from '@/components/LoginForm';
import { useRouter } from "next/router";

const Index = () => {
  const { state } = useTask();
  const { currentUser } = state;
  const router = useRouter();

  useEffect(() => {
  
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Redirecting...</h1>
        <p className="text-xl text-muted-foreground">Taking you to your dashboard</p>
      </div>
    </div>
  );
};

export default Index;
