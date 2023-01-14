import { GroupsService } from './groups.service';
import { UsersService } from './users.service';

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
  { label: ['-n', '-name'], type: TYPE.NAME, required: true },
  { label: ['-s', '-surname'], type: TYPE.SURNAME, required: true },
  { label: ['-t', '-type'], type: TYPE.TYPE, required: true },
  { label: ['-e', '-email'], type: TYPE.EMAIL, required: true },
  { label: ['-p', '-phone'], type: TYPE.NUMBER, required: false },
];

const getToken = (param) =>
  TOKENS.filter((_) => _.label.includes(param))?.[0] || null;

const newError = (num) => {
  switch (num) {
    case 1:
      return 'Nieprawidłowa składnia';
    case 2:
      return 'Brak wymaganych argumentów';
    default:
      return 'Wystąpił błąd';
  }
};

const capitalizeFirst = (value) =>
  value.charAt(0).toUpperCase() + value.slice(1, value.length).toLowerCase();

const handleCommand = async (command) => {
  //? /add -n wiktor -s pawdasidv -t admin -e jffgdf@gmail.com -p 78238723;
  //?      -n wiktor -s pawdasidv -t admin -e jffgdf@gmail.com -p 78238723

  const commands = command.split(';');
  const response = {
    success: false,
    info: null,
    error: null,
  };

  for (const cmd of commands) {
    let args = cmd.split(' ');

    switch (commands[0].split(' ')[0]) {
      case '/add':
        args = cmd === commands[0] ? args.splice(1, args.length - 1) : args;

        if (
          TOKENS.some(
            (_) =>
              _.required &&
              !args.includes(_.label[0]) &&
              !args.includes(_.label[1])
          )
        ) {
          response.error = newError(2);
          return response;
        }

        const data = {
          name: null,
          surname: null,
          type: null,
          email: null,
          phone_number: null,
        };

        range(0, args.length, 2).forEach((param) => {
          const token = getToken(args[param]);

          if (getToken[args[param + 1]]) {
            response.error = newError(1);
            return response;
          }

          let value = args[param + 1];
          if (token.type === TYPE.NAME || token.type === TYPE.SURNAME)
            value = capitalizeFirst(value);

          data[token.type.toLowerCase()] = value;
        });

        const res = await UsersService.addUser(data);

        if (res.data.success) {
          response.info = `Dodano użytkownika ${data.name} ${data.surname} do bazy`;
          response.success = true;
        }

        break;

      case '/create':
        args =
          cmd === commands[0]
            ? args.splice(1, args.length - 1).join(' ')
            : args.join(' ');

        const res2 = await GroupsService.createGroup({ name: args });

        if (!res2.data.success) {
          response.error = newError();
          return response;
        }

        response.info = `Stworzono grupy i dodano do bazy`;
        response.success = true;

        break;
      case '/help':
        break;

      default:
        response.info = 'Nie ma takiej komendy';
        break;
    }
  }

  return response;
};

export { handleCommand };
