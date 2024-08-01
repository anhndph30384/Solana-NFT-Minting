import React from 'react'
import Image from 'next/image'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Link from 'next/link'
import { motion } from 'framer-motion'

function Header() {
    return (
        <motion.div
            className='text-white p-2 flex justify-between items-center bg-[#512da8]'
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Logo */}
            <h1 className='font-mono text-3xl font-extrabold md:pl-10'>NFT Project</h1>

            {/* Nav Links */}
            <div className="hidden md:block">
                <nav aria-label="Site Nav">
                    <ul className="flex items-center gap-6 text-sm">
                        <li>
                            <Link className="text-white text-[16px] transition hover:text-black/75" href="/">NFT Minting</Link>
                        </li>
                        <li>
                            <Link className="text-white text-[16px] transition hover:text-black/75" href="/collection">Collection</Link>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className='flex items-center justify-end md:justify-between'>
                {/* Wallet */}
                <WalletMultiButton />
                <div className="block md:hidden">
                    <button
                        className="p-2 text-white transition rounded hover:text-black/75"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

export default Header