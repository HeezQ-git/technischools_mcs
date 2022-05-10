import { DialogTitle } from '@mui/material';
import { DialogContent } from '@mui/material';
import { Button } from '@mui/material';
import { DialogActions } from '@mui/material';
import { Dialog } from '@mui/material';
import React, { useState, useEffect } from 'react';
import './Terminal.scss';

const Terminal = ({ opened, isTerminal }) => {
  return (
    <div className='terminal'>
      <Dialog
        open={opened}
        onClose={() => isTerminal(!opened)}
        className='terminal-container'
        sx={{ width: '70vw', height: '70vh' }}
      >
        <DialogTitle>d</DialogTitle>
        <div className='terminal'>
          <div className='terminal_console'>
            <p>d</p>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Terminal;
