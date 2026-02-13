<script lang="ts">
  import type { DirectoryUserRecord } from "$lib/server/user";

    /**
     * Props
     */
    // /** @type {Record<string, any> | null} */
    /**
     * @type {{
     *  Subject: { mode?: 'edit'|'create', collection?: string, item?: { id?: number|string, [key: string]: any } } | null,
     *  SetModifying: (subject: Record<string, any> | null, mode: string) => void,
     *  userId: string|number|undefined,
     *  isAdmin: boolean,
     *  eligibleDrivers: DirectoryUserRecord[]
     * }}
     */
    let { Subject, SetModifying, userId, isAdmin, eligibleDrivers } = $props();

    // initialize fields with safe defaults; $effect will populate when Subject arrives
    let fields = $state({
        name: '',
        type: '',
        seats: '',
        driver: userId,
    })

    $effect(() => {
        if (!Subject) return;

        if (Subject.mode === 'create') {
            fields.name = Subject?.item?.name || '';
            fields.type = Subject?.item?.type || '';
            fields.seats = Subject?.item?.seats || '';
        } else {
            fields.name = Subject?.item?.name || '';
            fields.type = Subject?.item?.type || '';
            fields.seats = Subject?.item?.seats || '';
        }
    });

    async function handleSubmit() {
        if (!Subject) return

        const itemPayload: { id?: number|string, name?: string, type?: string, seats?: number|string, driver?: string|number, [key: string]: any } = { ...fields }
        if (Subject.mode === 'edit' && Subject.item && Subject.item.id) {
            itemPayload.id = Subject.item.id
        }

        const payload = {
            mode: Subject.mode || 'create',
            collection: Subject.collection,
            item: itemPayload,
        }

        try {
            const res = await fetch('/api/carpool/vehicle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const result = await res.json()
            if (!res.ok) {
                const err = result?.error ?? result
                const message = typeof err === 'object' ? JSON.stringify(err, null, 2) : String(err)
                alert(message || 'Failed to save')
                return
            }

            // close modal and let parent refresh
            SetModifying && SetModifying(null, "create")
            // simple refresh of page to show changes
            location.reload()
        } catch (err) {
            console.error(err)
            alert('Error saving')
        }
    }
    
</script>
<div style="border: none; height: 0; width: 0; margin: 0; padding: 0;">
    <div class="modifyBody">
        <h2 class="modifyHeading">{Subject ? `${Subject.mode === 'edit' ? 'Edit' : 'Create'} Vehicle` : ''}</h2>
        <label>
            Name:
            <input bind:value={fields.name} type="text" placeholder="Name of the car (e.g. your name + type of car)" />
        </label>
        <label>
            Type:
            <select bind:value={fields.type}>
                <option value="" disabled>Select type...</option>
                <option value="Car">Car</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Minivan">Minivan</option>
                <option value="Van">Van</option>
                <option value="Shuttle">Shuttle</option>
                <option value="Bus">Bus</option>
                <option value="Plane">Plane</option>
                <option value="Other">Other</option>
            </select>
        </label>
        <label>
            Seats:
            <input bind:value={fields.seats} type="number" />
        </label>
        {#if isAdmin}    
            <label>
                Driver:
                <select bind:value={fields.driver}>
                    <option value="" disabled>Select driver...</option>
                    {#each eligibleDrivers as driver}
                        <option value={driver.id}>{driver.name}</option>
                    {/each}
                </select>
            </label>
        {/if}


        <div style="margin-top:12px; display:flex; gap:8px;">
            <button onclick={handleSubmit}>{Subject?.mode === 'edit' ? 'Save' : 'Create'}</button>
            <button onclick={() => SetModifying(null, "create")} type="button">Cancel</button>
        </div>
    </div>
</div>
<style>
    .modifyHeading {
        margin-top: 0;
    }
    .modifyBody {
        display: flex;
        flex-direction: column;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 20px;
        position: absolute;
        width: 500px;
        height: auto;
        top: calc(50% - 100px);
        left: calc(50% - 250px);
        z-index: 5;
        /* transform: translate(50%, 50%); */
    }
    div {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 10px;
        background-color: #f9f9f9;
        display: flex;
        flex-wrap: wrap;
    }
    span {
        flex: 0 0 50%;
    }
</style>