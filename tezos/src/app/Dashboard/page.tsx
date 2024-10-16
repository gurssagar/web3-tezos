'use client';
import { useState } from 'react';
import  BountiesList  from "@/components/bounties-list";
import RepoListPopup from "@/components/ui/RepoListPopup";
import Menu from "@/components/header/menu";
import Footer from "@/components/header/Footer";

export default function Dashboard() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <>
            <Menu/>
            <BountiesList/>
            <Footer/>
        </>
    );
}