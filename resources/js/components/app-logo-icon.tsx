import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img 
            src="/enrollnow.png" 
            alt="ENROLLNOW" 
            className={props.className}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
    );
}
