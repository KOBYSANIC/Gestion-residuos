import React from 'react';
import { Link } from 'react-router-dom';
import cutecat from '../../../assets/img/img/cutecat.png';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

const NotFound = ({Title, Description}) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%" 
        >
            <Heading color="gray.100" mb="4">
                {Title}
            </Heading>

            <Text color="gray.300" mb="4">
                {Description}
            </Text>
            
            <Box boxSize="200px" mb="4">
                <img src={cutecat} alt="Cute Cat" width="100%" height="100%" />
            </Box>
            
            <Button 
            colorScheme='teal'>
                <Link to="/">Regresar</Link>
            </Button>
        </Box>
    );
};

export default NotFound;
