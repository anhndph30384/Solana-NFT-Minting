import { findMetadataPda, PublicKey } from '@metaplex-foundation/js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import WalletContextProvider from '../contexts/WalletContextProvider'
import { useMetaplex } from '../hooks/useMetaplex'
import { motion } from 'framer-motion'
import Loading from '../components/Loading'
import Swal from 'sweetalert2'
import { SubmitHandler, useForm } from 'react-hook-form'
import { mintNFT } from '../utils/nfts'

type Inputs = {
  name: string,
  description: string,
  image: any
};

const Home: NextPage = () => {

  const wallet = useWallet();
  const metaplex = useMetaplex();

  const { register, watch, handleSubmit, formState: { errors }, reset } = useForm<Inputs>({
    defaultValues: {
      name: '',
      description: '',
      image: null
    }
  });
  const watchImage = watch('image');
  const [loading, setLoading] = useState(false);

  const [createdNftMetadata, setCreatedNftMetadata] = useState<any>();

  const onSubmit: SubmitHandler<Inputs> = async data => {
    setLoading(true);
    mintNFT(
      metaplex,
      data.name,
      data.description,
      data.image[0]
    ).then(nft => {
      setCreatedNftMetadata(nft?.nft.json)
      reset();
      setLoading(false);
      Swal.fire({
        icon: 'success',
        title: 'The deed has been done!',
        text: 'Your NFT was minted successfully!',
      });
      console.log(nft);
    }).catch(err => {
      Swal.fire({
        icon: 'error',
        title: 'Well, fudge. Something went wrong.',
        text: err.message,
      })
      setLoading(false);
    });
  };

  return (
    <div className='flex flex-col justify-end h-full md:flex-row'>

      <Head>
        <title>Solana NFT Project</title>
        <meta name="description" content="A simple project that helps you connect your Phantom wallets and mint NFTs." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* NFT Minted */}
      <motion.div
        key={createdNftMetadata}
        className='h-full w-[100%] md:w-[50%] flex flex-col items-center justify-center p-10 space-y-4'
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img src={createdNftMetadata ? createdNftMetadata.image : '/unkown-nft.png'} className='w-52 md:w-96' />
        <h2 className='font-mono text-xs text-center text-white md:text-base'>
          {createdNftMetadata ? createdNftMetadata.name : 'Your minted NFT will be here!'}
        </h2>

      </motion.div>

      {/* Minting Form  */}
      <motion.div
        className='h-screen relative w-[100%] md:w-[70%] bg-white p-30 flex flex-col items-center py-5 px-10'
        initial={{ x: 500 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}

      >
        <img src='/nft-minting.png' className='w-72' />
        <h1 className='font-mono text-xl font-extrabold text-center md:text-3xl'>Mint your NFT here!</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='w-full py-5 space-y-5 xl:px-32'
        >
          <label className="form-input-label" htmlFor="name">
            <input
              id="name"
              placeholder="Name"
              className="form-input-input peer"
              {...register("name", { required: true })}
            />
            <span className="form-input-span">Name*</span>
          </label>
          {errors.name && <span className='text-sm text-red-700'>Name is required</span>}
          <label className="form-input-label" htmlFor="description">
            <input
              id="description"
              placeholder="Description"
              className="form-input-input peer"
              {...register("description")}
            />
            <span className="form-input-span">Description (Optional)</span>
          </label>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {watchImage && watchImage[0] ? watchImage[0].name : 'SVG, PNG or JPG (MAX. 800x400px)'}
                </p>
                {errors.image && <span className='text-sm text-red-700'>Image is required</span>}
              </div>
              <input id="dropzone-file" type="file" accept='image/*' className="hidden" {...register("image", { required: true })} />
            </label>
          </div>
          {wallet.publicKey ?
            <button type='submit' className='w-full bg-[#512da8] text-white rounded p-4 h-16  font-semibold'>
              {loading ? <Loading /> : 'Mint'}
            </button>
            : <button disabled className='w-full h-16 p-4 font-semibold text-white bg-gray-500 rounded'>
              Sign in to Mint
            </button>
          }
        </form>

      </motion.div>
    </div>
  );
}

export default Home
