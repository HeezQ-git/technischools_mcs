import React, { useState, useEffect } from 'react';
import { handleCommand } from '../../../services/terminal.service';
import './Terminal.scss';

const Terminal = ({ opened, isTerminal }) => {
  const [responses, setResponses] = useState([]);
  const [value, setValue] = useState(null);

  const execute = async () => {
    const res = await handleCommand(value);

    if (!res.success && res.error) {
      responses.push(res.error);
      setResponses([...responses]);
    } else {
      responses.push(res.info);
      setResponses([...responses]);
    }
    setValue('');
  };

  return (
    <div>
      {opened && (
        <div
          className='terminal-container'
          // onClick={(e) => {
          //   if (e.target.className == 'blocker') return;
          //   isTerminal(false);
          // }}
        >
          <div className='terminal'>
            <div className='console'>
              {responses.map((res, index) => {
                return <p key={index}>{res}</p>;
              })}
            </div>
            <div className='input_box'>
              <input
                onKeyDown={(e) => e.key === 'Enter' && execute()}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                className='input'
                placeholder='Впиши сюди команду..'
                value={value}
                onFocus={() => !value && setValue('/')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Terminal;
