import clsx from 'clsx';

function Icon({children, className, fill = 'currentColor', stroke, ...props}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      {...props}
      fill={fill}
      stroke={stroke}
      className={clsx('w-5 h-5', className)}
    >
      {children}
    </svg>
  );
}

export function IconMenu(props) {
  return (
    <Icon {...props} stroke={props.stroke || 'currentColor'}>
      <title>Menu</title>
      <line x1="3" y1="6.375" x2="17" y2="6.375" strokeWidth="1.25" />
      <line x1="3" y1="10.375" x2="17" y2="10.375" strokeWidth="1.25" />
      <line x1="3" y1="14.375" x2="17" y2="14.375" strokeWidth="1.25" />
    </Icon>
  );
}

export function IconClose(props) {
  return (
    <Icon {...props} stroke={props.stroke || 'currentColor'}>
      <title>Close</title>
      <line
        x1="4.44194"
        y1="4.30806"
        x2="15.7556"
        y2="15.6218"
        strokeWidth="1.25"
      />
      <line
        y1="-0.625"
        x2="16"
        y2="-0.625"
        transform="matrix(-0.707107 0.707107 0.707107 0.707107 16 4.75)"
        strokeWidth="1.25"
      />
    </Icon>
  );
}

export function IconArrow({direction = 'right'}) {
  let rotate;

  switch (direction) {
    case 'right':
      rotate = 'rotate-0';
      break;
    case 'left':
      rotate = 'rotate-180';
      break;
    case 'up':
      rotate = '-rotate-90';
      break;
    case 'down':
      rotate = 'rotate-90';
      break;
    default:
      rotate = 'rotate-0';
  }

  return (
    <Icon className={`w-5 h-5 ${rotate}`}>
      <title>Arrow</title>
      <path d="M7 3L14 10L7 17" strokeWidth="1.25" />
    </Icon>
  );
}

export function IconCaret({
  direction = 'down',
  stroke = 'currentColor',
  ...props
}) {
  let rotate;

  switch (direction) {
    case 'down':
      rotate = 'rotate-0';
      break;
    case 'up':
      rotate = 'rotate-180';
      break;
    case 'left':
      rotate = '-rotate-90';
      break;
    case 'right':
      rotate = 'rotate-90';
      break;
    default:
      rotate = 'rotate-0';
  }

  return (
    <Icon
      {...props}
      className={`w-5 h-5 transition ${rotate}`}
      fill="transparent"
      stroke={stroke}
    >
      <title>Caret</title>
      <path d="M14 8L10 12L6 8" strokeWidth="1.25" />
    </Icon>
  );
}

export function IconSelect(props) {
  return (
    <Icon {...props}>
      <title>Select</title>
      <path d="M7 8.5L10 6.5L13 8.5" strokeWidth="1.25" />
      <path d="M13 11.5L10 13.5L7 11.5" strokeWidth="1.25" />
    </Icon>
  );
}

export function IconBag(props) {
  return (
    <Icon {...props}>
      <title>Bag</title>
      <path
        fillRule="evenodd"
        d="M8.125 5a1.875 1.875 0 0 1 3.75 0v.375h-3.75V5Zm-1.25.375V5a3.125 3.125 0 1 1 6.25 0v.375h3.5V15A2.625 2.625 0 0 1 14 17.625H6A2.625 2.625 0 0 1 3.375 15V5.375h3.5ZM4.625 15V6.625h10.75V15c0 .76-.616 1.375-1.375 1.375H6c-.76 0-1.375-.616-1.375-1.375Z"
      />
    </Icon>
  );
}

export function IconAccount(props) {
  return (
    <Icon {...props}>
      <title>Account</title>
      <path
        fillRule="evenodd"
        d="M9.9998 12.625c-1.9141 0-3.6628.698-5.0435 1.8611C3.895 13.2935 3.25 11.7221 3.25 10c0-3.728 3.022-6.75 6.75-6.75 3.7279 0 6.75 3.022 6.75 6.75 0 1.7222-.645 3.2937-1.7065 4.4863-1.3807-1.1632-3.1295-1.8613-5.0437-1.8613ZM10 18c-2.3556 0-4.4734-1.0181-5.9374-2.6382C2.7806 13.9431 2 12.0627 2 10c0-4.4183 3.5817-8 8-8s8 3.5817 8 8-3.5817 8-8 8Zm0-12.5c-1.567 0-2.75 1.394-2.75 3s1.183 3 2.75 3 2.75-1.394 2.75-3-1.183-3-2.75-3Z"
      />
    </Icon>
  );
}

export function IconHelp(props) {
  return (
    <Icon {...props}>
      <title>Help</title>
      <path d="M3.375 10a6.625 6.625 0 1 1 13.25 0 6.625 6.625 0 0 1-13.25 0ZM10 2.125a7.875 7.875 0 1 0 0 15.75 7.875 7.875 0 0 0 0-15.75Zm.699 10.507H9.236V14h1.463v-1.368ZM7.675 7.576A3.256 3.256 0 0 0 7.5 8.67h1.245c0-.496.105-.89.316-1.182.218-.299.553-.448 1.005-.448a1 1 0 0 1 .327.065c.124.044.24.113.35.208.108.095.2.223.272.383.08.154.12.34.12.558a1.3 1.3 0 0 1-.076.471c-.044.131-.11.252-.197.361-.08.102-.174.197-.283.285-.102.087-.212.182-.328.284a3.157 3.157 0 0 0-.382.383c-.102.124-.19.27-.262.438a2.476 2.476 0 0 0-.164.591 6.333 6.333 0 0 0-.043.81h1.179c0-.263.021-.485.065-.668a1.65 1.65 0 0 1 .207-.47c.088-.139.19-.263.306-.372.117-.11.244-.223.382-.34l.35-.306c.116-.11.218-.23.305-.361.095-.139.168-.3.219-.482.058-.19.087-.412.087-.667 0-.35-.062-.664-.186-.942a1.881 1.881 0 0 0-.513-.689 2.07 2.07 0 0 0-.753-.427A2.721 2.721 0 0 0 10.12 6c-.4 0-.764.066-1.092.197a2.36 2.36 0 0 0-.83.536c-.225.234-.4.515-.523.843Z" />
    </Icon>
  );
}

export function IconSearch(props) {
  return (
    <Icon {...props}>
      <title>Search</title>
      <path
        fillRule="evenodd"
        d="M13.3 8.52a4.77 4.77 0 1 1-9.55 0 4.77 4.77 0 0 1 9.55 0Zm-.98 4.68a6.02 6.02 0 1 1 .88-.88l4.3 4.3-.89.88-4.3-4.3Z"
      />
    </Icon>
  );
}

export function IconCheck({stroke = 'currentColor', ...props}) {
  return (
    <Icon {...props} fill="transparent" stroke={stroke}>
      <title>Check</title>
      <circle cx="10" cy="10" r="7.25" strokeWidth="1.25" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m7.04 10.37 2.42 2.41 3.5-5.56"
      />
    </Icon>
  );
}

export function IconRemove(props) {
  return (
    <Icon {...props} fill="transparent" stroke={props.stroke || 'currentColor'}>
      <title>Remove</title>
      <path
        d="M4 6H16"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M5.5 6L6 17H14L14.5 6"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 6L8 5C8 4 8.75 3 10 3C11.25 3 12 4 12 5V6"
        strokeWidth="1.25"
      />
    </Icon>
  );
}

export function IconView(props) {
  return (
    <Icon {...props}>
      <title>View Count</title>
      <path
        d="M0.908202 9.43351L1.14093 9.69272L0.908201 9.43352C0.563933 9.74262 0.563933 10.2574 0.908201 10.5665L0.908203 10.5665L1.62675 11.2116C1.62693 11.2118 1.62711 11.212 1.62729 11.2121C6.24865 15.396 13.7513 15.396 18.3727 11.2121C18.3729 11.212 18.3731 11.2118 18.3733 11.2116L19.0918 10.5665C19.4361 10.2574 19.4361 9.74262 19.0918 9.43352L18.3733 8.78837C18.3731 8.78818 18.3729 8.78798 18.3726 8.78779C13.7513 4.60404 6.24862 4.60407 1.62728 8.78788C1.6271 8.78805 1.62692 8.78821 1.62675 8.78837L0.908202 9.43351Z"
        strokeWidth="0.7"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.0053 12.9934C11.6861 12.9934 13.0486 11.6308 13.0486 9.95004C13.0486 8.26926 11.6861 6.90671 10.0053 6.90671C8.32455 6.90671 6.96201 8.26926 6.96201 9.95004C6.96201 11.6308 8.32455 12.9934 10.0053 12.9934Z"
        strokeWidth="0.7"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IconAddToCart(props) {
  return (
    <Icon {...props}>
      <title>Add to Cart</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.00237947 4.83117C0.0257696 4.62066 0.215384 4.46897 0.425895 4.49236L3.49397 4.83325C3.65996 4.8517 3.79493 4.97544 3.82768 5.13921L4.31146 7.55809H15.7239C15.8448 7.55809 15.9586 7.61506 16.031 7.71184C16.1034 7.80861 16.126 7.93386 16.0918 8.04981L14.5313 13.3556C14.398 13.809 13.9819 14.1204 13.5093 14.1204H5.36135L4.81827 14.935C4.68612 15.1332 4.82822 15.3987 5.06646 15.3987H14.3603C14.5721 15.3987 14.7438 15.5704 14.7438 15.7822C14.7438 15.994 14.5721 16.1657 14.3603 16.1657H5.06646C4.21561 16.1657 3.70811 15.2175 4.18008 14.5095L4.74889 13.6563L3.13055 5.56461L0.341192 5.25468C0.130681 5.23129 -0.0210106 5.04168 0.00237947 4.83117ZM5.47051 13.3533H13.5093C13.6416 13.3533 13.7581 13.2662 13.7955 13.1392L15.2114 8.32511H4.46486L5.47051 13.3533Z"
      />
      <path d="M14.0193 17.6572C14.0193 18.1279 13.6377 18.5095 13.167 18.5095C12.6963 18.5095 12.3148 18.1279 12.3148 17.6572C12.3148 17.1865 12.6963 16.805 13.167 16.805C13.6377 16.805 14.0193 17.1865 14.0193 17.6572Z" />
      <path d="M6.0086 18.5095C6.47928 18.5095 6.86084 18.1279 6.86084 17.6572C6.86084 17.1865 6.47928 16.805 6.0086 16.805C5.53792 16.805 5.15635 17.1865 5.15635 17.6572C5.15635 18.1279 5.53792 18.5095 6.0086 18.5095Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.1678 10.6645C17.8365 10.6645 20 8.501 20 5.83223C20 3.16346 17.8365 1 15.1678 1C12.499 1 10.3355 3.16346 10.3355 5.83223C10.3355 8.501 12.499 10.6645 15.1678 10.6645ZM16.996 5.22552V6.07116H15.6429V7.62552H14.7087V6.07116H13.3557V5.22552H14.7087V3.73558H15.6429V5.22552H16.996Z"
      />
    </Icon>
  );
}
