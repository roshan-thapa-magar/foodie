import React from 'react';
import { Button } from '../ui/button';

export default function AddressBook() {
  return (
    <div>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className="text-2xl font-extrabold">Address Book</h1>
          <p className="font-bold">Here you can manage all your saved addresses.</p>
        </div>
        <Button>Add Address</Button>
      </div>
    </div>
  );
}
