"use client"
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';

const Header = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate=useRouter()

    return (
        <AppBar position="static" className='bg-pink-500'>
            <Toolbar>
                {isMobile && (
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                )}
                <Typography variant="h6" sx={{ flexGrow: 1 }} onClick={()=>navigate.push("/")}>
                    WORD PLAY
                </Typography>
                {!isMobile && (
                    <>
                        <Button color="inherit">Home</Button>
                        <Button color="inherit">About</Button>
                        <Button color="inherit">Games</Button>
                        <Button color="inherit">Contact</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
