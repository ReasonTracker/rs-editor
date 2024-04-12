'use client';
import { useEffect, useState } from "react";
import "./ScoreBoard.css";

export default function ScoreBoard({ score, isAddingNode }: { score: number | undefined, isAddingNode: boolean }) {

    const [scoreString, setScoreString] = useState<string>("    ")

    useEffect(() => {
        if (isAddingNode) return
        if (score === undefined) {
            setScoreString("    ");
            return;
        }

        const abortController = new AbortController();

        async function effect() {
            setScoreString((oldScoreString) => {
                let newScore = score===undefined? .99 : score;
                newScore = (newScore + 1) / 2;
                if (newScore > .99) newScore = .99;
                if (newScore < .01) newScore = .01;
                newScore = Math.floor(newScore * 100);
                return newScore.toString().padStart(2, " ") +
                    (100 - newScore).toString().padStart(2, " ");
            })
        }

        effect();
        return () => abortController.abort();
    }, [score, isAddingNode])


    return <div className="scoreBoard">
        <div className="digits">
            <svg className={`numDisplay d0 o${scoreString[0]}`} viewBox="0 0 100 180">

                <path className="seg s0 n0 n2 n3 n5 n6 n7 n8 n9" d="
      M 15 10 
      L 20 5 
      L 80 5 
      L 85 10 
      L 67.5 27.5 
      L 32.5 27.5
      Z
    "></path>

                <path className="seg s1 n0 n4 n5 n6 n8 n9" d="
      M 10 15 
      L 5 20 
      L 5 77.5 
      L 10 85 
      L 27.5 75 
      L 27.5 32.5
      Z
    "></path>

                <path className="seg s2 n0 n1 n2 n3 n4 n7 n8 n9" d="
      M 90 15 
      L 95 20 
      L 95 77.5 
      L 90 85 
      L 72.5 75 
      L 72.5 32.5
      Z
    "></path>

                <path className="seg s3 n2 n3 n4 n5 n6 n8 n9" d="
      M 15 90 
      L 32.5 80 
      L 67.5 80 
      L 85 90 
      L 67.5 100 
      L 32.5 100 
      Z
    "></path>

                <path className="seg s4 n0 n2 n6 n8" d="
      M 5 102.5 
      L 10 95 
      L 27.5 105 
      L 27.5 147.5 
      L 10 165 
      L 5 160
      Z
    "></path>

                <path className="seg s5 n0 n2 n3 n5 n6 n8" d="
      M 32.5 152.5 
      L 67.5 152.5 
      L 85 170 
      L 80 175 
      L 20 175 
      L 15 170
      Z
    "></path>

                <path className="seg s6 n0 n1 n3 n4 n5 n6 n7 n8 n9" d="
      M 95 102.5 
      L 90 95 
      L 72.5 105 
      L 72.5 147.5 
      L 90 165 
      L 95 160
      Z
    "></path>


            </svg>
            <svg className={`numDisplay d1 o${scoreString[1]}`} viewBox="0 0 100 180">

                <path className="seg s0 n0 n2 n3 n5 n6 n7 n8 n9" d="
      M 15 10 
      L 20 5 
      L 80 5 
      L 85 10 
      L 67.5 27.5 
      L 32.5 27.5
      Z
    "></path>

                <path className="seg s1 n0 n4 n5 n6 n8 n9" d="
      M 10 15 
      L 5 20 
      L 5 77.5 
      L 10 85 
      L 27.5 75 
      L 27.5 32.5
      Z
    "></path>

                <path className="seg s2 n0 n1 n2 n3 n4 n7 n8 n9" d="
      M 90 15 
      L 95 20 
      L 95 77.5 
      L 90 85 
      L 72.5 75 
      L 72.5 32.5
      Z
    "></path>

                <path className="seg s3 n2 n3 n4 n5 n6 n8 n9" d="
      M 15 90 
      L 32.5 80 
      L 67.5 80 
      L 85 90 
      L 67.5 100 
      L 32.5 100 
      Z
    "></path>

                <path className="seg s4 n0 n2 n6 n8" d="
      M 5 102.5 
      L 10 95 
      L 27.5 105 
      L 27.5 147.5 
      L 10 165 
      L 5 160
      Z
    "></path>

                <path className="seg s5 n0 n2 n3 n5 n6 n8" d="
      M 32.5 152.5 
      L 67.5 152.5 
      L 85 170 
      L 80 175 
      L 20 175 
      L 15 170
      Z
    "></path>

                <path className="seg s6 n0 n1 n3 n4 n5 n6 n7 n8 n9" d="
      M 95 102.5 
      L 90 95 
      L 72.5 105 
      L 72.5 147.5 
      L 90 165 
      L 95 160
      Z
    "></path>


            </svg>
        </div>

        <span className="separator">&nbsp;</span>

        <div className="digits">
            <svg className={`numDisplay d2 o${scoreString[2]}`} viewBox="0 0 100 180">

                <path className="seg s0 n0 n2 n3 n5 n6 n7 n8 n9" d="
      M 15 10 
      L 20 5 
      L 80 5 
      L 85 10 
      L 67.5 27.5 
      L 32.5 27.5
      Z
    "></path>

                <path className="seg s1 n0 n4 n5 n6 n8 n9" d="
      M 10 15 
      L 5 20 
      L 5 77.5 
      L 10 85 
      L 27.5 75 
      L 27.5 32.5
      Z
    "></path>

                <path className="seg s2 n0 n1 n2 n3 n4 n7 n8 n9" d="
      M 90 15 
      L 95 20 
      L 95 77.5 
      L 90 85 
      L 72.5 75 
      L 72.5 32.5
      Z
    "></path>

                <path className="seg s3 n2 n3 n4 n5 n6 n8 n9" d="
      M 15 90 
      L 32.5 80 
      L 67.5 80 
      L 85 90 
      L 67.5 100 
      L 32.5 100 
      Z
    "></path>

                <path className="seg s4 n0 n2 n6 n8" d="
      M 5 102.5 
      L 10 95 
      L 27.5 105 
      L 27.5 147.5 
      L 10 165 
      L 5 160
      Z
    "></path>

                <path className="seg s5 n0 n2 n3 n5 n6 n8" d="
      M 32.5 152.5 
      L 67.5 152.5 
      L 85 170 
      L 80 175 
      L 20 175 
      L 15 170
      Z
    "></path>

                <path className="seg s6 n0 n1 n3 n4 n5 n6 n7 n8 n9" d="
      M 95 102.5 
      L 90 95 
      L 72.5 105 
      L 72.5 147.5 
      L 90 165 
      L 95 160
      Z
    "></path>


            </svg>
            <svg className={`numDisplay d3 o${scoreString[3]}`} viewBox="0 0 100 180">

                <path className="seg s0 n0 n2 n3 n5 n6 n7 n8 n9" d="
      M 15 10 
      L 20 5 
      L 80 5 
      L 85 10 
      L 67.5 27.5 
      L 32.5 27.5
      Z
    "></path>

                <path className="seg s1 n0 n4 n5 n6 n8 n9" d="
      M 10 15 
      L 5 20 
      L 5 77.5 
      L 10 85 
      L 27.5 75 
      L 27.5 32.5
      Z
    "></path>

                <path className="seg s2 n0 n1 n2 n3 n4 n7 n8 n9" d="
      M 90 15 
      L 95 20 
      L 95 77.5 
      L 90 85 
      L 72.5 75 
      L 72.5 32.5
      Z
    "></path>

                <path className="seg s3 n2 n3 n4 n5 n6 n8 n9" d="
      M 15 90 
      L 32.5 80 
      L 67.5 80 
      L 85 90 
      L 67.5 100 
      L 32.5 100 
      Z
    "></path>

                <path className="seg s4 n0 n2 n6 n8" d="
      M 5 102.5 
      L 10 95 
      L 27.5 105 
      L 27.5 147.5 
      L 10 165 
      L 5 160
      Z
    "></path>

                <path className="seg s5 n0 n2 n3 n5 n6 n8" d="
      M 32.5 152.5 
      L 67.5 152.5 
      L 85 170 
      L 80 175 
      L 20 175 
      L 15 170
      Z
    "></path>

                <path className="seg s6 n0 n1 n3 n4 n5 n6 n7 n8 n9" d="
      M 95 102.5 
      L 90 95 
      L 72.5 105 
      L 72.5 147.5 
      L 90 165 
      L 95 160
      Z
    "></path>


            </svg>
        </div>

        <svg >
            <defs>
                <radialGradient id="orange">
                    <stop offset="10%" stopColor="hsl(30deg 100% 80%)" />
                    <stop offset="95%" stopColor="hsl(30deg 100% 42%)" />
                </radialGradient>
                <radialGradient id="purple">
                    <stop offset="10%" stopColor="hsl(276deg 100% 80%)" />
                    <stop offset="95%" stopColor="hsl(276deg 100% 65%)" />
                </radialGradient>
            </defs>
        </svg>

    </div>
}