const form = document.getElementById('creiForm')
const steps = Array.from(document.querySelectorAll('.step'))
const nextButtons = Array.from(document.querySelectorAll('.next'))
const backButtons = Array.from(document.querySelectorAll('.back'))
const progressBar = document.getElementById('progressBar')
const progressSteps = document.getElementById('progressSteps')
let current = 0

function updateProgress(){
  const pct = ((current+1)/steps.length)*100
  progressBar.style.width = pct+'%'
  progressSteps.textContent = 'Paso '+(current+1)+' de '+steps.length
}

function showStep(idx){
  steps.forEach((s,i)=>s.classList.toggle('active', i===idx))
  current = idx
  updateProgress()
}

function validateStep(idx){
  const section = steps[idx]
  const required = Array.from(section.querySelectorAll('[required]'))
  let ok = true
  required.forEach(el=>{
    const wrap = el.closest('.field')
    const old = wrap?.querySelector('.error')
    if(old) old.remove()
    let valid = true
    if(el.type==='radio'){
      const name = el.name
      const any = section.querySelector('input[type="radio"][name="'+name+'"]:checked')
      valid = !!any
    }else if(el.type==='checkbox'){
      const name = el.name
      const any = section.querySelectorAll('input[type="checkbox"][name="'+name+'"]:checked').length>0
      valid = any
    }else{
      valid = el.value.trim().length>0
      if(el.type==='email'){
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim())
      }
    }
    if(!valid){
      ok=false
      if(wrap){
        const m = document.createElement('div')
        m.className='error'
        m.textContent='Completa este campo'
        wrap.appendChild(m)
      }
    }
  })
  return ok
}

nextButtons.forEach(b=>{
  b.addEventListener('click', ()=>{
    if(validateStep(current)){
      showStep(Math.min(current+1, steps.length-1))
    }
  })
})
backButtons.forEach(b=>{
  b.addEventListener('click', ()=>showStep(Math.max(current-1,0)))
})

const optionGroups = Array.from(document.querySelectorAll('.options'))
optionGroups.forEach(group=>{
  const inputs = Array.from(group.querySelectorAll('input[type="radio"], input[type="checkbox"]'))
  const refresh = ()=>{
    inputs.forEach(i=>{
      const opt = i.closest('.option')
      if(!opt) return
      if(i.type==='radio'){
        const checked = group.querySelector('input[type="radio"][name="'+i.name+'"]:checked')
        opt.classList.toggle('selected', !!checked && i===checked)
      }else{
        opt.classList.toggle('selected', i.checked)
      }
    })
  }
  inputs.forEach(i=>{
    i.addEventListener('change', refresh)
    i.addEventListener('focus', ()=>i.closest('.option')?.classList.add('selected'))
    i.addEventListener('blur', refresh)
  })
  refresh()
})

const otroS = document.getElementById('otroSustancia')
const otroSTexto = document.getElementById('otroSustanciaTexto')
if(otroS && otroSTexto){
  otroSTexto.style.display='none'
  otroS.addEventListener('change', ()=>{
    const on = otroS.checked
    otroSTexto.style.display = on ? 'block' : 'none'
    otroSTexto.toggleAttribute('required', on)
  })
}

const otroT = document.getElementById('otroTratamiento')
const otroTTexto = document.getElementById('otroTratamientoTexto')
if(otroT && otroTTexto){
  otroTTexto.style.display='none'
  otroT.addEventListener('change', ()=>{
    const on = otroT.checked
    otroTTexto.style.display = on ? 'block' : 'none'
    otroTTexto.toggleAttribute('required', on)
  })
}

const tipos = document.getElementById('tiposTratamiento')
form.addEventListener('change', e=>{
  if(e.target.name==='tratamiento_antes'){
    const v = e.target.value
    const disabled = v!=='Sí'
    tipos.querySelectorAll('input[type="checkbox"]').forEach(c=>{
      c.checked=false
      c.disabled=disabled
    })
    if(disabled){
      otroTTexto.style.display='none'
      otroTTexto.removeAttribute('required')
      otroTTexto.value=''
    }
  }
})

const medioOtroTexto = document.getElementById('medioOtroTexto')
if(medioOtroTexto){
  medioOtroTexto.style.display='none'
  const radios = Array.from(document.querySelectorAll('input[type="radio"][name="medio_conocio"]'))
  const sync = ()=>{
    const sel = radios.find(r=>r.checked)
    const isOtro = sel && sel.value==='Otro'
    medioOtroTexto.style.display = isOtro ? 'block' : 'none'
    medioOtroTexto.toggleAttribute('required', isOtro)
    if(!isOtro){ medioOtroTexto.value='' }
  }
  radios.forEach(r=>r.addEventListener('change', sync))
}

form.addEventListener('submit', e=>{
  if(!validateStep(current)) {
    e.preventDefault()
    return
  }
  const lastOk = steps.every((s,idx)=>idx===current || validateStep(idx))
  if(!lastOk){
    e.preventDefault()
    showStep(steps.findIndex((s,idx)=>!validateStep(idx)))
    return
  }
  const btn = document.getElementById('submitBtn')
  btn.disabled=true
  btn.textContent='Enviando...'
})

showStep(0)
updateProgress()
