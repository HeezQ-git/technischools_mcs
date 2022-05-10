import { GroupsService } from './groups.service';
import { MailerService } from './mailer.service';
import { MessagesService } from './messages.service';
import { UsersService } from './users.service';

//? /add -n wiktor -s pawdasidv -t admin -e jffgdf@gmail.com -p 78238723; -n wiktor -s pawdasidv -t admin -e jffgdf@gmail.com -p 78238723
//? /create _name_;_name2_

const range = (start, stop, step = 1) =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step);

const TYPE = {
  NAME: 'NAME',
  SURNAME: 'SURNAME',
  TYPE: 'TYPE',
  EMAIL: 'EMAIL',
  NUMBER: 'NUMBER',
};

const TOKENS = [
  { label: ['-n', '-name'], type: TYPE.NAME },
  { label: ['-s', '-surname'], type: TYPE.SURNAME },
  { label: ['-t', '-type'], type: TYPE.TYPE },
  { label: ['-e', '-email'], type: TYPE.EMAIL },
  { label: ['-p', '-phone'], type: TYPE.NUMBER },
];

const getToken = (param) =>
  TOKENS.filter((_) => _.label.includes(param))?.[0] || null;

const newError = (num) => {
  const data = { error: 'Nieznany błąd' };

  switch (num) {
    case 1:
      data.error = 'Nieprawidłowa składnia';
      break;
  }

  return data;
};

const handleCommand = async (command) => {
  //? /add -n wiktor -s pawdasidv -t admin -e jffgdf@gmail.com -p 78238723;
  //?      -n wiktor -s pawdasidv -t admin -e jffgdf@gmail.com -p 78238723

  let commands = command.split(';');
  for (const cmd of commands) {
    let args = cmd.split(' ');
    switch (commands[0].split(' ')[0]) {
      case '/add':
        args = cmd == commands[0] ? args.splice(1, args.length - 1) : args;

        const data = {
          name: null,
          surname: null,
          type: null,
          email: null,
          number: null,
        };

        range(0, args.length, 2).forEach((param) => {
          const token = getToken(args[param]);

          if (getToken[args[param + 1]]) return newError(1);

          data[token.type.toLowerCase()] = args[param + 1];
        });

        const res = await UsersService.addUser(data);
        console.log(res);

        break;

      case '/create':
        break;
    }
  }
};

export { handleCommand };
