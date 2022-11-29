/** @jsxImportSource @emotion/react */
import { useState, useContext } from 'react';
import { ThemeContext } from '../../../App';
import { handleCommand } from '../../../services/terminal.service';
import { TerminalStyles } from './terminal.styles';

const Terminal = ({ opened, isTerminal }) => {
  const [responses, setResponses] = useState([]);
  const [value, setValue] = useState(null);

  const {theme} = useContext(ThemeContext);

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
          css={TerminalStyles.wrapper}
          // onClick={(e) => {
          //   if (e.target.className == 'blocker') return;
          //   isTerminal(false);
          // }}
        >
          <div css={TerminalStyles.terminal(theme)}>
            <div className='console'>
              {responses.map((res, index) => {
                return <p key={index}>{res}</p>;
              })}
            </div>
            <div css={TerminalStyles.inputBox}>
              <input
                onKeyDown={(e) => e.key === 'Enter' && execute()}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                css={TerminalStyles.input}
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
