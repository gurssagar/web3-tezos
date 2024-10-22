'use client';
import { useState } from 'react';
import  BountiesList  from "@/components/bounties-list";
import RepoListPopup from "@/components/ui/RepoListPopup";
import Menu from "@/components/header/menu";
import Footer from "@/components/header/Footer";
interface Bounty {
    id: string;
    title: string;
    repo: string;
    issue: string;
    reward: string;
    status: string;
}

export default function Dashboard() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleBountyClick = (bounty: Bounty) => {
        // Handle bounty click logic here
        console.log('Bounty clicked:', bounty);
    };

    return (
        <>
            <Menu/>
            <BountiesList onBountyClick={handleBountyClick}/>
            <Footer/>
        </>
    );
}
