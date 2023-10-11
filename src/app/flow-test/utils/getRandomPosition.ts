export default function useRandomPosition() {
    const maxX = 250;  
    const maxY = 250; 
    
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);

    return { x, y };
}