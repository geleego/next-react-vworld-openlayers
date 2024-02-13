import Link from 'next/link';

const Headers = () => {
    return (
        <>
            <HeaderStyled>
                <Link href="/">
                    <a id="logo">
                        <div className="fnt-nsqre">Vworld Openlayers</div>
                    </a>
                </Link>
            </HeaderStyled>
        </>
    );
};

export default Headers;