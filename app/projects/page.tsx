'use client'
import React, {useState} from 'react';
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'


type caseStudyType ={
    currentId:number
}
const Projects = ({currentId}:caseStudyType) => {
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    const [urls, setUrls] = useState([
        "/projects/hvac_dashboard.png", // id: 1 - HVAC IoT (but has detailed case study, won't use this)
        "/projects/aimGame.svg",        // id: 2 - Aim Game
        "/projects/citreas.svg",        // id: 3 - Life Line
        "/projects/lifeLine.svg",       // id: 4 - MediQem
        "/projects/mediCem.svg",        // id: 5 - MyStartup
        "/projects/myStartUp.svg",      // id: 6 - RCB
        "/projects/rcb.png",
    ]);

    let currentImageId:number=-1;
    if (id !== null)
        currentImageId = parseInt(id)

    return (
        <div className="flex justify-center absolute top-0 py-10 sm:py-0">
            <Image 
            src={urls[currentImageId-1]}
                   width={0}
                   height={0}
                   onLoadingComplete={(image) => image.classList.remove('animate-pulse')}
                   sizes="100vw" alt={"project_1"}
                   className='animate-pulse bg-slate-500 min-h-screen'
                   style={{ width: '100vw', height: 'auto'}}/>
        </div>
    );
};

export default Projects;