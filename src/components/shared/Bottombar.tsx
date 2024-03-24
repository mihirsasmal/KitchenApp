import { bottombarLinks } from '@/constants';
import { INavLink } from '@/types';
import { Link, useLocation } from 'react-router-dom';

const Bottombar = () => {
    const {pathname} = useLocation();
  return (
    <section className='bottom-bar'>
         {bottombarLinks.map((link:INavLink)=> {
                const isActive = pathname=== link.route;
                return (

                         <Link to={link.route}
                          key ={link.label} className={`bottombar-link group ${isActive && 'bg-primary-500 rounded-[10px] transition'} flex-center flex-col gap-1 p-2 transition-transform`}>
                             <img 
                             src={link.imgURL}
                             alt={link.label}
                             width={16}
                             height={16}
                             className={`${isActive && 'invert-white'}`}/>
                             <p className= {`tiny-medium dark:text-light-2 text-dark-4 ${isActive && 'text-light-1 '}`}>{link.label}</p>
                         </Link>
                  
                )
            })
        }

        
    </section>
  )
}

export default Bottombar