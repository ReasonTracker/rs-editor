export interface Calculated<ScoreType> { 
    scores: { [id: string]: ScoreType }
}