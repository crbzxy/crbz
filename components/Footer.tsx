
const Footer: React.FC = () => {
    return (
        <footer className="fixed bottom-0 w-full h-[50px] text-black flex justify-center items-center bg-white">
            ©{new Date().getFullYear()} CBO
        </footer>
    );
};

export default Footer;