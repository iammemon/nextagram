import Head from './head'

export default ({children})=>(
   <div>
       <Head/>
       <div>
           {children}
       </div>
   </div>
)