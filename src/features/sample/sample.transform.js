import { formatNumber } from '../../utility/formatters.js'
import { sortByKey } from '../../utility/sorters.js';

export function normalizeElectionResultsPayload(rawPayload) {
    const widgetData = rawPayload.widgets[0];

    return {
        eventId: rawPayload.id,
        eventActive: rawPayload.active,
        eventTitle: rawPayload.title,
        created: new Date(rawPayload.createdAt * 1000).toISOString(),
        updated: new Date(rawPayload.updatedAt * 1000).toISOString(),
        races: (rawPayload.races || []).map(normalizeRaceData),
        widgetId: widgetData.id,
        widgetTitle: widgetData.title,
        widgetConfig: {
            showImages: widgetData.showImages,
            showPercentOfPrecincts: widgetData.showPercentOfPrecincts,
            showPrecincts: widgetData.showPrecincts,
            widgetType: widgetData.widgetType,
            showSearchBar: widgetData.showSearchBar,
            candidateListExpandable: widgetData.candidateListExpandable,
            showTitle: widgetData.showTitle,
            showTotalVotes: widgetData.showTotalVotes,
            raceMetadata: widgetData.raceMetadata,
            showTimestamp: widgetData.showTimestamp,
            showWinner: widgetData.showWinner,
            raceDisplay: widgetData.raceDisplay,
            showTotalPrecincts: widgetData.showTotalPrecincts,
            showName: widgetData.showName,
            sortCandidatesByVotes: widgetData.sortCandidatesByVotes,
            createdAt: new Date(widgetData.createdAt * 1000).toISOString(),
            updatedAt: new Date(widgetData.updatedAt * 1000).toISOString(),
            eventId: widgetData.eventId,
            showCandidates: widgetData.showCandidates,
            showParty: widgetData.showParty,
            accountId: widgetData.accountId,
            showVotes: widgetData.showVotes,
            showPercentOfVotesDecimal: widgetData.showPercentOfVotesDecimal,
            showPercentOfVotes: widgetData.showPercentOfVotes,
            title: widgetData.title,
            id: widgetData.id
        }
    }

}

function normalizeRaceData(raceData) {
    let totalVotesHuman = raceData?.votesCast_override ?? raceData.votesCast;
    totalVotesHuman = formatNumber(totalVotesHuman);

    let candidates = (raceData?.candidates || []).map(normalizeCandidateData);
    candidates = sortByKey(candidates, 'voteCount', 'desc');
    
    // Mark the leading candidate (if votes have been cast)
    if (candidates.length > 0 && Number(candidates[0].voteCount) > 0) {
        const topVotes = Number(candidates[0].voteCount);
        const secondVotes = candidates[1] ? Number(candidates[1].voteCount) : -1;

        // Only mark as winning if there isn't a tie for 1st place
        if (topVotes > secondVotes) {
            candidates[0].isWinning = true;
        }
    }

    return {
        id: raceData.id,
        description: raceData?.description_override ?? raceData.description,
        label: raceData?.name_override ?? raceData.name,
        totalVotes: raceData?.votesCast_override ?? raceData.votesCast,
        totalVotesHuman: totalVotesHuman,
        type: raceData.raceType,
        precints: {
            percentReporting: raceData?.precinctsPercent_override ?? raceData.precinctsPercent,
            numberReporting: raceData?.precinctsReporting_override ?? raceData.precinctsReporting,
            totalPrecincts: raceData?.precinctsTotal_override ?? raceData.precinctsTotal
        },
        created: new Date(raceData.createdAt * 1000).toISOString(),
        updated: new Date(raceData.updatedAt * 1000).toISOString(),
        infoUpdated: raceData.raceInfoUpdatedAt,
        candidates: candidates
    }
}

function normalizeCandidateData(candidateData) {
    let voteCountHuman = candidateData?.votes_override ?? candidateData.votes;
    voteCountHuman = formatNumber(voteCountHuman);

    let votePercentHuman = candidateData?.percentage_override ?? candidateData.percentage;
    if(votePercentHuman > 0) { votePercentHuman = votePercentHuman/100 }
    votePercentHuman = formatNumber(votePercentHuman, { isPercent: true, decimals: 2 });

    const party = candidateData?.party_override ?? candidateData?.party;

    return {
        id: candidateData.id,
        label: candidateData?.name_override ?? candidateData.name,
        isWinner: candidateData?.winner_override ?? candidateData.winner,
        isWinning: false,
        isIncumbent: candidateData?.incumbent_override ?? candidateData.incumbent,
        votePercent: candidateData?.percentage_override ?? candidateData.percentage,
        votePercentHuman: votePercentHuman,
        voteCount: candidateData?.votes_override ?? candidateData.votes,
        voteCountHuman: voteCountHuman,
        party: party,
        partyColor: getPartyColor(party)
    }
}

function getPartyColor(partyName) {
    const DEFAULT_COLOR = '#999';

    if (!partyName || typeof partyName !== 'string') {
        return DEFAULT_COLOR;
    }

    // Normalize: lowercase, trim, and remove periods or parentheses (e.g., "(D)", "Rep.")
    const normalized = partyName.toLowerCase().replace(/[().]/g, '').trim();

    if (!normalized) {
        return DEFAULT_COLOR;
    }

    // 1. Check exact matches and common abbreviations safely
    const republicanAliases = new Set(['r', 'rep', 'repub', 'republican', 'gop']);
    const democratAliases = new Set(['d', 'dem', 'dems', 'democrat', 'democratic']);
    const independentAliases = new Set(['i', 'ind', 'indep', 'independent', 'unaffiliated', 'no party', 'np', 'npa', 'nonpartisan']);
    const libertarianAliases = new Set(['l', 'lib', 'libertarian']);
    const greenAliases = new Set(['g', 'grn', 'green']);

    if (republicanAliases.has(normalized)) return '#CD3D3D';
    if (democratAliases.has(normalized)) return '#3D66CD';
    if (independentAliases.has(normalized)) return '#999';
    if (libertarianAliases.has(normalized)) return '#EAC23E';
    if (greenAliases.has(normalized)) return '#00A95C';

    // 2. Fallback to substring checks for multi-word labels (e.g., "Democratic-Farmer-Labor", "Green Party")
    if (normalized.includes('republican') || normalized.includes('gop')) return '#CD3D3D';
    if (normalized.includes('democrat')) return '#3D66CD';
    if (normalized.includes('independent') || normalized.includes('nonpartisan')) return '#999';
    if (normalized.includes('libertarian')) return '#EAC23E';
    if (normalized.includes('green')) return '#00A95C';

    return DEFAULT_COLOR;
}