import React from "react";
import { Icon as IconWrapper } from "outline-icons";

type iconSVGProps = {
  color?: string;
  size?: number;
  r?: number;
  cx?: number;
  cy?: number;
  fill?: string;
  strokeWidth?: number;
  stroke?: string;
};

export const CircleIcon = ({
  color,
  size,
  ...rest
}: iconSVGProps): React.ReactElement<iconSVGProps> => (
  <IconWrapper color={color} size={size}>
    <circle {...rest} />
  </IconWrapper>
);

export const RemoveIcon = ({
  color,
  size,
}: iconSVGProps): React.ReactElement<iconSVGProps> => (
  <div style={{ marginTop: 4, marginLeft: 4 }}>
    <IconWrapper color={color} size={size}>
      <svg
        width="19px"
        height="16px"
        viewBox="0 0 19 16"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>icon</title>
        <g
          id="Knowt-6-Editor"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g
            id="Artboard"
            transform="translate(-70.000000, -56.000000)"
            fill="#FFFFFF"
          >
            <g id="icon" transform="translate(70.000000, 56.000000)">
              <path
                d="M15,0 C15.5128358,0 15.9355072,0.38604019 15.9932723,0.88337888 L16,1 L16,5.61483519 C16,5.69690861 15.9966323,5.77881993 15.9899356,5.8603674 C15.9966912,5.90581613 16,5.95252166 16,6 C16,6.1805703 15.9521405,6.3499624 15.8684145,6.4961832 C15.8658881,6.5018105 15.864041,6.5077569 15.8621752,6.513698 L15.7854301,6.7290072 L14,11.191 L14,15 C14,15.5128358 13.6139598,15.9355072 13.1166211,15.9932723 L13,16 L1,16 C0.44771525,16 0,15.5522847 0,15 C0,14.4871642 0.38604019,14.0644928 0.88337888,14.0067277 L1,14 L8,14 L8,11.194 L6.2145699,6.7290072 C6.1839016,6.6523364 6.1564596,6.5745518 6.1322835,6.495859 C6.0478595,6.3499624 6,6.1805703 6,6 C6,5.95252166 6.0033088,5.90581613 6.0097083,5.86010142 C6.0095959,5.85466244 6.0091437,5.84895569 6.0087078,5.84324723 L6,5.61483519 L6,1 C6,0.44771525 6.4477152,0 7,0 C7.5128358,0 7.9355072,0.38604019 7.9932723,0.88337888 L8,1 L8,5 L14,5 L14,1 C14,0.44771525 14.4477153,0 15,0 Z M12,12 L10,12 L10,14 L12,14 L12,12 Z M13.522,7 L8.477,7 L9.677,10 L12.322,10 L13.522,7 Z"
                id="Shape"
                fillRule="nonzero"
              ></path>
              <path
                d="M-0.593312439,6.65971037 L18.8153832,6.65971037 C19.2187912,6.65971037 19.545818,6.98673716 19.545818,7.39014515 C19.545818,7.79355314 19.2187912,8.12057994 18.8153832,8.12057994 L-0.593312439,8.12057994 C-0.99672043,8.12057994 -1.32374722,7.79355314 -1.32374722,7.39014515 C-1.32374722,6.98673716 -0.99672043,6.65971037 -0.593312439,6.65971037 Z"
                id="Rectangle"
                transform="translate(9.111035, 7.390145) rotate(35.000000) translate(-9.111035, -7.390145) "
              ></path>
            </g>
          </g>
        </g>
      </svg>
    </IconWrapper>
  </div>
);
