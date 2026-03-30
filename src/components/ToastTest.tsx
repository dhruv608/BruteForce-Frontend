"use client";

import { toast } from '@/utils/toast';
import { glassToast } from '@/utils/toast-system';

export default function ToastTest() {
  const testSuccess = () => {
    toast.success('This is a premium success toast!');
  };

  const testError = () => {
    toast.error('This is a premium error toast!');
  };

  const testWarning = () => {
    toast.warning('This is a premium warning toast!');
  };

  const testInfo = () => {
    toast.info('This is a premium info toast!');
  };

  const testLoading = () => {
    toast.loading('This is a premium loading toast...');
  };

  const testGlassToast = () => {
    glassToast.success('Glass toast direct call works!');
  };

  const testPromise = () => {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve('Success!') : reject('Error!');
      }, 2000);
    });

    toast.promise(promise, {
      loading: 'Loading promise...',
      success: 'Promise completed successfully!',
      error: 'Promise failed!',
    });
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Premium Toast Test</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <button
          onClick={testSuccess}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Success Toast
        </button>
        
        <button
          onClick={testError}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Error Toast
        </button>
        
        <button
          onClick={testWarning}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Warning Toast
        </button>
        
        <button
          onClick={testInfo}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Info Toast
        </button>
        
        <button
          onClick={testLoading}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Loading Toast
        </button>
        
        <button
          onClick={testGlassToast}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Glass Toast Direct
        </button>
        
        <button
          onClick={testPromise}
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 col-span-2 md:col-span-3"
        >
          Promise Toast (Random Result)
        </button>
      </div>
    </div>
  );
}
