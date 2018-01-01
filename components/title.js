export default ({small,text}) => (
    <h1 className={small && 'small'}>
        {text}
        <style jsx>{`
        @font-face {
            font-family: 'billabongregular';
            src: url('https://rawgit.com/milktronics/beaglegr.am/master/public/fonts/billabong-webfont.eot');
            src: url('https://rawgit.com/milktronics/beaglegr.am/master/public/fonts/billabong-webfont.eot?#iefix') format('embedded-opentype'),
                 url('https://rawgit.com/milktronics/beaglegr.am/master/public/fonts/billabong-webfont.woff') format('woff'),
                 url('https://rawgit.com/milktronics/beaglegr.am/master/public/fonts/billabong-webfont.ttf') format('truetype'),
                 url('https://rawgit.com/milktronics/beaglegr.am/master/public/fonts/billabong-webfont.svg#billabongregular') format('svg');
            font-weight: normal;
            font-style: normal;

        }
        h1{
        font-family: billabong, 'billabongregular';
        text-align :center;
        font-weight: 100;
        font-size:calc(5rem + 12vmin);     
        margin :2rem 0;
        letter-spacing: -1px; 
        text-shadow :0px 4px 0 rgba(18, 86, 136, 0.11);
        color:#3D6582; 
        }
        .small {
            font-size:30px;
            font-weight:600
            margin:0 1rem;
            text-shadow:none;
            letter-spacing:1.5px;
            
        }    
        `}</style>
    </h1>
)