import { useNavigate } from "react-router-dom";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
import type { CreateUserDto } from "@/services/auth"; // Supondo que o tipo viva aqui

// --- 1. ATUALIZAÇÃO: DEFININDO OS PROPS QUE O COMPONENTE RECEBE ---
interface CreateAccountFormStep1Props {
  onNext: () => void;
  formData: Partial<CreateUserDto>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreateAccountFormStep1 = ({ onNext, formData, handleChange }: CreateAccountFormStep1Props) => {
    const navigate = useNavigate();

    const goToLogin = () => {
        // Navega para /login, que é a rota correta que definimos
        navigate("/login");
    }

    // A função de submit não é necessária aqui, pois o botão "Próximo"
    // apenas avança a etapa, e os dados já estão sendo salvos no pai.
    const handleNext = (e: React.MouseEvent) => {
      e.preventDefault(); // Previne qualquer comportamento padrão do botão
      // Poderíamos adicionar validações aqui antes de avançar
      onNext();
    }

    return (
        <div className="flex flex-col gap-6">
            {/* O form não precisa mais de um onSubmit aqui */}
            <form className="grid gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Informações Pessoais</h1>
                    <p className="text-balance text-sm text-muted-foreground">
                        Preencha seus dados para criar uma nova conta
                    </p>
                </div>

                {/* --- 2. MODIFICAÇÃO: CONECTANDO OS INPUTS AOS PROPS --- */}
                <div className="grid gap-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                        className="bg-transparent"
                        id="name" // IMPORTANTE: o id deve corresponder à chave no estado formData
                        type="text" 
                        placeholder="Digite seu nome completo" 
                        required 
                        value={formData.name || ''}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="department">Departamento</Label>
                    <Input 
                        className="bg-transparent"
                        id="department" // IMPORTANTE: o id deve corresponder à chave no estado formData
                        type="text" 
                        placeholder="Digite seu departamento" 
                        required 
                        value={formData.department || ''}
                        onChange={handleChange}
                    />
                </div>

                {/* O input de foto (file) é mais complexo de controlar.
                    Por simplicidade, vamos deixá-lo sem controle por enquanto,
                    mas o ideal seria um handler específico para ele. */}
                <div className="grid gap-2">
                    <Label htmlFor="photo">Foto</Label>
                    <Input 
                        className="bg-transparent"
                        id="photo" 
                        type="file" 
                        accept="image/*"
                    />
                </div>

                <div className="grid gap-3">
                    <Button type="button" className="w-full shadow-md" onClick={handleNext}>
                        Próximo
                    </Button>
                    <Button 
                        onClick={goToLogin}
                        variant="muted" 
                        className="w-full" 
                        type="button"
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CreateAccountFormStep1;