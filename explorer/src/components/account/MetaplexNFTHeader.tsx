import "bootstrap/dist/js/bootstrap.min.js";
import { NFTData } from "providers/accounts";
import { Creator } from "metaplex/classes";
import { ArtContent } from "metaplex/Art/Art";
import { InfoTooltip } from "components/common/InfoTooltip";
import { EditionData } from "providers/accounts/utils/metadataHelpers";
import { clusterPath } from "utils/url";
import { Link } from "react-router-dom";

export function NFTHeader({
  nftData,
  address,
}: {
  nftData: NFTData;
  address: string;
}) {
  const metadata = nftData.metadata;
  return (
    <div className="row align-items-begin">
      <div className="col-auto ml-2">
        <ArtContent metadata={metadata} pubkey={address} />
      </div>

      <div className="col mb-3 ml-n3 ml-md-n2 mt-3">
        {<h6 className="header-pretitle ml-1">Metaplex NFT</h6>}
        <div className="d-flex align-items-center">
          <h2 className="header-title ml-1 align-items-center">
            {metadata.data.name !== ""
              ? metadata.data.name
              : "No NFT name was found"}
          </h2>
          {getEditionPill(nftData.editionData)}
        </div>
        <h4 className="header-pretitle ml-1 mt-1">
          {metadata.data.symbol !== ""
            ? metadata.data.symbol
            : "No Symbol was found"}
        </h4>
        <div className="mb-2 mt-2">
          {getSaleTypePill(metadata.primarySaleHappened)}
        </div>
        <div className="mb-3 mt-2">{getIsMutablePill(metadata.isMutable)}</div>
        <div className="btn-group">
          <button
            className="btn btn-dark btn-sm dropdown-toggle creators-dropdown-button-width"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Creators
          </button>
          <div className="dropdown-menu mt-2">
            {getCreatorDropdownItems(metadata.data.creators)}
          </div>
        </div>
      </div>
    </div>
  );
}

function getCreatorDropdownItems(creators: Creator[] | null) {
  const CreatorHeader = () => {
    const creatorTooltip =
      "Verified creators signed the metadata associated with this NFT when it was created.";

    const shareTooltip =
      "The percentage of the proceeds a creator receives when this NFT is sold.";

    return (
      <div
        className={
          "d-flex align-items-center dropdown-header creator-dropdown-entry"
        }
      >
        <div className="d-flex text-monospace creator-dropdown-header">
          <span>Creator Address</span>
          <InfoTooltip bottom text={creatorTooltip} />
        </div>
        <div className="d-flex text-monospace">
          <span className="text-monospace">Royalty</span>
          <InfoTooltip bottom text={shareTooltip} />
        </div>
      </div>
    );
  };

  const getVerifiedIcon = (isVerified: boolean) => {
    const className = isVerified ? "fe fe-check" : "fe fe-alert-octagon";
    return <i className={`ml-3 ${className}`}></i>;
  };

  const CreatorEntry = (creator: Creator) => {
    return (
      <div
        className={
          "d-flex align-items-center text-monospace creator-dropdown-entry ml-3 mr-3"
        }
      >
        {getVerifiedIcon(creator.verified)}
        <Link
          className="dropdown-item text-monospace creator-dropdown-entry-address"
          to={clusterPath(`/address/${creator.address}`)}
        >
          {creator.address}
        </Link>
        <div className="mr-3"> {`${creator.share}%`}</div>
      </div>
    );
  };

  if (creators && creators.length > 0) {
    let listOfCreators: JSX.Element[] = [];

    listOfCreators.push(<CreatorHeader key={"header"} />);
    creators.forEach((creator) => {
      listOfCreators.push(<CreatorEntry key={creator.address} {...creator} />);
    });

    return listOfCreators;
  }

  return (
    <div className={"dropdown-item text-monospace"}>
      <div className="mr-3">No creators are associated with this NFT.</div>
    </div>
  );
}

function getEditionPill(editionData?: EditionData) {
  const masterEdition = editionData?.masterEdition;
  const edition = editionData?.edition;

  return (
    <div className={"d-inline-flex ml-2"}>
      <span className="badge badge-pill badge-dark">{`${
        edition && masterEdition
          ? `Edition ${edition.edition.toNumber()} / ${masterEdition.supply.toNumber()}`
          : masterEdition
          ? "Master Edition"
          : "No Master Edition Information"
      }`}</span>
    </div>
  );
}

function getSaleTypePill(hasPrimarySaleHappened: boolean) {
  const primaryMarketTooltip =
    "Creator(s) split 100% of the proceeds when this NFT is sold.";

  const secondaryMarketTooltip =
    "Creator(s) split the Seller Fee when this NFT is sold. The owner receives the remaining proceeds.";

  return (
    <div className={"d-inline-flex align-items-center"}>
      <span className="badge badge-pill badge-dark">{`${
        hasPrimarySaleHappened ? "Secondary Market" : "Primary Market"
      }`}</span>
      <InfoTooltip
        bottom
        text={
          hasPrimarySaleHappened ? secondaryMarketTooltip : primaryMarketTooltip
        }
      />
    </div>
  );
}

function getIsMutablePill(isMutable: boolean) {
  return (
    <span className="badge badge-pill badge-dark">{`${
      isMutable ? "Mutable" : "Immutable"
    }`}</span>
  );
}
