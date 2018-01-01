import {Children} from 'react'

export default ({children})=>(
    <div className="grid">
        {Children.map(children,(child,i)=>(
            <div className="grid-card" key={i}>
                {child}
            </div>
        ))}
        <style jsx>{`
            .grid{
                display:flex;
                flex-wrap:wrap;
                justify-content:flex-start;
            }
            .grid-card{
                margin:10px 10px;
            }
            @media only screen and (max-width:768px){
                .grid{
                    justify-content:center
                }
            }
        `}</style>
    </div>
)