// AuthForm.jsx
import React, { useState } from 'react';
import { Button, Input, FormControl, FormLabel, Box, Text } from '@chakra-ui/react';
import { registerUser, loginUser, logoutUser } from './Auth';

const AuthForm = ({ isLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await loginUser(email, password);
        alert('Giriş başarılı!');
      } else {
        await registerUser(email, password);
        alert('Kayıt başarılı!');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box maxW="400px" mx="auto" p={4} borderWidth={1} borderRadius="md">
      <form onSubmit={handleSubmit}>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email"
          />
        </FormControl>

        <FormControl id="password" isRequired mt={4}>
          <FormLabel>Password</FormLabel>
          <Input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password"
          />
        </FormControl>

        <Button 
          type="submit" 
          colorScheme="teal" 
          width="full" 
          mt={4}
        >
          {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
        </Button>
      </form>

      {error && (
        <Text color="red.500" mt={4}>
          Hata: {error}
        </Text>
      )}
    </Box>
  );
};

export default AuthForm;
