import React, { useState, useEffect } from 'react';
import { Amplify, API } from 'aws-amplify';
import { withAuthenticator, Button, Heading, TextField, View, Flex } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// IMPORTANT: Create your aws-exports.js file from the template
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

function App({ signOut, user }) {
  const [bills, setBills] = useState([]);
  const [formState, setFormState] = useState({ name: '', amount: '' });

  useEffect(() => {
    fetchBills();
  }, []);

  async function fetchBills() {
    try {
      // The name 'ApiGateway' here MUST match the name in your aws-exports.js
      const apiData = await API.get('ApiGateway', '/bills');
      setBills(apiData);
    } catch (error) {
      console.error('error fetching bills:', error);
    }
  }

  async function addBill(event) {
    event.preventDefault();
    try {
      const bill = { ...formState, amount: parseFloat(formState.amount) };
      await API.post('ApiGateway', '/bills', {
        body: bill
      });
      fetchBills(); // Refresh the list
      setFormState({ name: '', amount: '' }); // Clear form
    } catch (error) {
      console.error('error adding bill:', error);
    }
  }
  
  async function deleteBill(billId) {
    try {
      await API.del('ApiGateway', `/bills/${billId}`);
      fetchBills(); // Refresh the list
    } catch (error) {
      console.error('error deleting bill:', error);
    }
  }

  return (
    <View padding="2rem">
      <Flex direction="row" justifyContent="space-between" alignItems="center">
        <Heading level={1}>My Bills Dashboard</Heading>
        <Button onClick={signOut}>Sign Out, {user.username}</Button>
      </Flex>
      
      <View as="form" margin="3rem 0" onSubmit={addBill}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="name"
            placeholder="Bill Name (e.g., Netflix)"
            label="Bill Name"
            labelHidden
            variation="quiet"
            required
            value={formState.name}
            onChange={e => setFormState({...formState, name: e.target.value})}
          />
          <TextField
            name="amount"
            placeholder="Amount"
            label="Amount"
            labelHidden
            variation="quiet"
            type="number"
            step="0.01"
            required
            value={formState.amount}
            onChange={e => setFormState({...formState, amount: e.target.value})}
          />
          <Button type="submit" variation="primary">Create Bill</Button>
        </Flex>
      </View>

      <Heading level={2}>Current Bills</Heading>
      <View margin="1rem 0">
        {bills.map(bill => (
          <Flex
            key={bill.billId}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            border="1px solid #ccc"
            padding="1rem"
            marginBottom="0.5rem"
          >
            <p><strong>{bill.name}</strong> - ${bill.amount}</p>
            <Button variation="link" onClick={() => deleteBill(bill.billId)}>Delete</Button>
          </Flex>
        ))}
      </View>
    </View>
  );
}

export default withAuthenticator(App);