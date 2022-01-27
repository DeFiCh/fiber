import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@store'
import { getReleaseChannel } from '@api/releaseChannel'
import { getEnvironment } from '@environment'
import dayjs from 'dayjs'

// MAX_TIME_DIFF set to 45 mins to display warning message (in AnnouncementBanner) when blockchain is down only in Production mode, else 5 seconds for local runs
const MAX_TIME_DIFF = getEnvironment(getReleaseChannel()).debug ? 5 * 1000 : 45 * 60 * 1000 // 45 mins in milliseconds

export function useBlockchainStatus (): boolean {
    const { lastSync, lastSuccessfulSync } = useSelector((state: RootState) => state.block)
    const [isBlockchainDown, setIsBlockchainDown] = useState(false)

    useEffect(() => {
        function getBlockchainStatus (): boolean {
            if (lastSync !== undefined && lastSuccessfulSync !== undefined) {
                const lastSyncTime = dayjs(lastSync).valueOf() // returns in milliseconds
                const lastSuccessfulSyncTime = dayjs(lastSuccessfulSync).valueOf()
                const timeDifference = lastSyncTime - lastSuccessfulSyncTime
                return timeDifference > MAX_TIME_DIFF
            }
            return false
          }
        setIsBlockchainDown(getBlockchainStatus())
    }, [lastSync])
    return isBlockchainDown
}
