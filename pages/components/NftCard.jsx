export const NftCard = ({ nft }) => {

    return (
        <div className="w-1/4 flex flex-col">
            <div className="rounded-md">
                <img className="object-cover h-128 w-full rounded-t-md" src={nft.media[0].gateway} />
            </div>
            <div className="flex flex-col y-gap-2 px-2 bg-slate-100 rounded-b-md h-110">
                <div className="">
                    <h2 className="text-xl text-gray-800">{nft.title}</h2>
                    <p className="text-gray-600 ">Id:{nft.id.tokenId.substr(nft.id.tokenId.length - 4)}</p>
                    <p className="text-gray-600">{`${nft.contract.address.substr(0, 4)}...${nft.contract.address.substr(nft.contract.address.length - 4)}`}</p>

                </div>
                <div>
                    <h2>{nft.description?.substr(0, 150)}</h2>
                </div>
            </div>
            <div className="flex justify-center mb-1">
                <a href={`https://etherscan.io/token/${nft.contract.address}`} target={"_blank"} className="py-2 px-4 bg-blue-500 w-1/2 text-center rouded-m text-white cursor-pointer">View on etherscan</a>
            </div>
        </div>
    )
}